import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import * as apiIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

interface PortfolioStackProps extends cdk.StackProps {
  domainName: string;
  apiSubdomain: string;
  sesFromAddress: string;
  sestoAddress: string;
}

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PortfolioStackProps) {
    super(scope, id, props);

    const { domainName, apiSubdomain, sesFromAddress, sestoAddress } = props;

    // =========================================================
    // 1. ROUTE 53 — look up existing hosted zone
    // =========================================================
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName,
    });

    // =========================================================
    // 2. ACM CERTIFICATE
    // Must be in us-east-1 for CloudFront. Since this stack IS
    // in us-east-1, we create it here directly.
    // DNS validation automatically adds CNAME records to Route 53.
    // =========================================================
    const certificate = new acm.Certificate(this, "SiteCertificate", {
      domainName,
      subjectAlternativeNames: [`*.${domainName}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // =========================================================
    // 3. S3 BUCKET — stores static assets from OpenNext build
    // Private bucket; CloudFront accesses via OAC (Origin Access Control)
    // =========================================================
    const assetsBucket = new s3.Bucket(this, "AssetsBucket", {
      bucketName: `${domainName}-assets`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // keep assets if stack is deleted
      autoDeleteObjects: false,
    });

    // =========================================================
    // 4. LAMBDA — Next.js server function (OpenNext output)
    // Handles all SSR requests, API routes, and dynamic pages.
    // =========================================================
    const serverFunction = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      // OpenNext bundles the server into .open-next/server-functions/default
      // Path is relative to the Next.js project root after open-next build
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../app/.open-next/server-functions/default")
      ),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NEXT_PUBLIC_API_URL: `https://${apiSubdomain}`,
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
      logGroup: new logs.LogGroup(this, "ServerFunctionLogGroup", {
        retention: logs.RetentionDays.ONE_MONTH,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    });

    // Grant server function read access to assets bucket (for ISR cache reads)
    assetsBucket.grantReadWrite(serverFunction);

    // Lambda Function URL — CloudFront uses this as the SSR origin
    const serverFunctionUrl = serverFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // CloudFront handles auth
      cors: {
        allowedOrigins: [`https://${domainName}`],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ["*"],
      },
    });

    // =========================================================
    // 5. LAMBDA — Image optimization function (OpenNext output)
    // Handles next/image requests at /_next/image
    // =========================================================
    const imageOptFunction = new lambda.Function(this, "ImageOptFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../app/.open-next/image-optimization-function")
      ),
      memorySize: 1536,
      timeout: cdk.Duration.seconds(25),
      environment: {
        BUCKET_NAME: assetsBucket.bucketName,
        BUCKET_KEY_PREFIX: "_assets",
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
      logGroup: new logs.LogGroup(this, "ImageOptFunctionLogGroup", {
        retention: logs.RetentionDays.ONE_MONTH,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    });

    assetsBucket.grantRead(imageOptFunction);

    const imageOptFunctionUrl = imageOptFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // =========================================================
    // 6. CLOUDFRONT DISTRIBUTION
    // Three origins:
    //   a) S3 — static assets (_next/static/*, public files)
    //   b) Image opt Lambda — /_next/image requests
    //   c) Server Lambda — everything else (SSR, pages, API)
    // =========================================================

    // Origin Access Control for S3 (modern replacement for OAI)
    const oac = new cloudfront.S3OriginAccessControl(this, "S3OAC", {
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
    });

    // S3 static assets origin
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(
      assetsBucket,
      { originAccessControl: oac, originPath: "/_assets" }
    );

    // Server Lambda origin
    const serverOrigin = new origins.FunctionUrlOrigin(serverFunctionUrl);

    // Image optimization Lambda origin
    const imageOrigin = new origins.FunctionUrlOrigin(imageOptFunctionUrl);

    // Cache policy for static assets — long TTL, immutable
    const staticCachePolicy = new cloudfront.CachePolicy(this, "StaticCachePolicy", {
      cachePolicyName: "portfolio-static-assets",
      defaultTtl: cdk.Duration.days(365),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(365),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    // Cache policy for server-rendered pages — no cache at edge by default
    // (Next.js manages its own cache headers)
    const serverCachePolicy = new cloudfront.CachePolicy(this, "ServerCachePolicy", {
      cachePolicyName: "portfolio-server",
      defaultTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        "accept",
        "rsc",
        "next-router-prefetch",
        "next-router-state-tree",
        "next-url",
        "x-prerender-revalidate"
      ),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
    });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      domainNames: [domainName, `www.${domainName}`],
      certificate,
      defaultBehavior: {
        // Default: all requests go to the Next.js server Lambda
        origin: serverOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: serverCachePolicy,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        compress: true,
      },
      additionalBehaviors: {
        // Static Next.js assets — long-lived, served from S3
        "/_next/static/*": {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: staticCachePolicy,
          compress: true,
        },
        // Public folder files — served from S3
        "/favicon.ico": {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: staticCachePolicy,
          compress: true,
        },
        "/*.webp": {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: staticCachePolicy,
          compress: true,
        },
        "/*.svg": {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: staticCachePolicy,
          compress: true,
        },
        "/*.png": {
          origin: s3Origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: staticCachePolicy,
          compress: true,
        },
        // Image optimization
        "/_next/image*": {
          origin: imageOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
      },
      // Custom error pages — unknown routes return 404.html with 404 status
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404",
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404",
          ttl: cdk.Duration.seconds(0),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US/EU only — lowest cost
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    // Grant CloudFront OAC permission to read from S3
    assetsBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [`${assetsBucket.bucketArn}/*`],
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
          },
        },
      })
    );

    // =========================================================
    // 7. UPLOAD STATIC ASSETS TO S3
    // Uploads .open-next/assets (public files + _next/static)
    // =========================================================
    new s3deploy.BucketDeployment(this, "DeployAssets", {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, "../../app/.open-next/assets")
        ),
      ],
      destinationBucket: assetsBucket,
      destinationKeyPrefix: "_assets",
      distribution,
      distributionPaths: ["/_next/static/*"],
      memoryLimit: 256,
    });

    // =========================================================
    // 8. ROUTE 53 — A records pointing to CloudFront
    // =========================================================
    new route53.ARecord(this, "ApexARecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.ARecord(this, "WwwARecord", {
      zone: hostedZone,
      recordName: "www",
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution)
      ),
    });

    // =========================================================
    // 9. DYNAMODB — ContactSubmissions table
    // On-demand billing; no capacity planning needed at this scale
    // =========================================================
    const contactTable = new dynamodb.Table(this, "ContactSubmissions", {
      tableName: "portfolio-contact-submissions",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // =========================================================
    // 10. SSM PARAMETERS — secrets/config (never hardcoded)
    // =========================================================
    new ssm.StringParameter(this, "SesFromParam", {
      parameterName: "/portfolio/ses/from-address",
      stringValue: sesFromAddress,
      description: "SES FROM address for contact form emails",
    });

    new ssm.StringParameter(this, "SesToParam", {
      parameterName: "/portfolio/ses/to-address",
      stringValue: sestoAddress,
      description: "SES TO address — owner notification recipient",
    });

    new ssm.StringParameter(this, "CorsOriginParam", {
      parameterName: "/portfolio/api/cors-origin",
      stringValue: `https://${domainName}`,
      description: "Allowed CORS origin for API Gateway",
    });

    // =========================================================
    // 11. LAMBDA — Contact form handler
    // Writes to DynamoDB, sends SES notification + confirmation
    // =========================================================
    const contactLambda = new lambda.Function(this, "ContactFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/contact")),
      memorySize: 256,
      timeout: cdk.Duration.seconds(15),
      environment: {
        TABLE_NAME: contactTable.tableName,
        SES_FROM: sesFromAddress,
        SES_TO: sestoAddress,
        CORS_ORIGIN: `https://${domainName}`,
      },
      logGroup: new logs.LogGroup(this, "ContactFunctionLogGroup", {
        retention: logs.RetentionDays.THREE_MONTHS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    });

    // Grant contact Lambda write access to DynamoDB
    contactTable.grantWriteData(contactLambda);

    // Grant contact Lambda permission to send email via SES
    contactLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: [
          `arn:aws:ses:us-east-1:${this.account}:identity/${domainName}`,
          `arn:aws:ses:us-east-1:${this.account}:identity/${sesFromAddress}`,
          `arn:aws:ses:us-east-1:${this.account}:identity/${sestoAddress}`,
        ],
      })
    );

    // =========================================================
    // 12. API GATEWAY (HTTP API) — api.jasonljohnson.com
    // HTTP API is faster and cheaper than REST API for this use case
    // =========================================================
    const httpApi = new apigateway.HttpApi(this, "HttpApi", {
      apiName: "portfolio-api",
      description: "Portfolio contact form API",
      corsPreflight: {
        allowOrigins: [`https://${domainName}`],
        allowMethods: [apigateway.CorsHttpMethod.POST, apigateway.CorsHttpMethod.OPTIONS],
        allowHeaders: ["content-type", "authorization"],
        maxAge: cdk.Duration.days(1),
      },
    });

    // Wire POST /contact to the contact Lambda
    httpApi.addRoutes({
      path: "/contact",
      methods: [apigateway.HttpMethod.POST],
      integration: new apiIntegrations.HttpLambdaIntegration(
        "ContactIntegration",
        contactLambda
      ),
    });

    // Custom domain for API Gateway — api.jasonljohnson.com
    const apiCertificate = new acm.Certificate(this, "ApiCertificate", {
      domainName: apiSubdomain,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const apiDomain = new apigateway.DomainName(this, "ApiDomain", {
      domainName: apiSubdomain,
      certificate: apiCertificate,
    });

    new apigateway.ApiMapping(this, "ApiMapping", {
      api: httpApi,
      domainName: apiDomain,
    });

    // Route 53 A record for api.jasonljohnson.com
    new route53.ARecord(this, "ApiARecord", {
      zone: hostedZone,
      recordName: "api",
      target: route53.RecordTarget.fromAlias(
        new route53targets.ApiGatewayv2DomainProperties(
          apiDomain.regionalDomainName,
          apiDomain.regionalHostedZoneId
        )
      ),
    });

    // =========================================================
    // OUTPUTS — printed after cdk deploy completes
    // =========================================================
    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${domainName}`,
      description: "Portfolio site URL",
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: `https://${apiSubdomain}`,
      description: "API Gateway URL",
    });

    new cdk.CfnOutput(this, "CloudFrontDistributionId", {
      value: distribution.distributionId,
      description: "CloudFront distribution ID — needed for cache invalidations",
    });

    new cdk.CfnOutput(this, "AssetsBucketName", {
      value: assetsBucket.bucketName,
      description: "S3 bucket name for static assets",
    });
  }
}
