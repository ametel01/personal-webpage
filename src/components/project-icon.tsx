import Image from "next/image";
import type { ProjectIconAsset } from "@/content/projects";

type ProjectIconProps = {
  icon: ProjectIconAsset;
  className?: string;
  size?: "default" | "home" | "large" | "resume";
};

export function ProjectIcon({ className = "", icon, size = "default" }: ProjectIconProps) {
  const classes = ["project-logo", `project-logo-${size}`, className].filter(Boolean);

  return (
    <span aria-hidden="true" className={classes.join(" ")}>
      <Image
        alt=""
        className="project-logo-image"
        height={96}
        src={icon.src}
        unoptimized
        width={96}
      />
    </span>
  );
}
