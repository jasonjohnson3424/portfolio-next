import { projects } from "../../../data/projects";
import ProjectDetail from "../../../pages/ProjectDetail";

export async function generateStaticParams() {
  const isDev = process.env.NODE_ENV === "development";
  return projects
    .filter((p) => p.status === "published" && (isDev || !p.protected))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Jason L. Johnson`,
    description: project.metaDescription || project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
