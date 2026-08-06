import type { LearningSkill } from "@content";
import { Tag } from "~/components/ui/tag";

interface SkillTagProps {
  skill: LearningSkill;
}

// A skill is only ever shown here because it's tied to a real course or
// certification — the same "evidence over a claim" principle already
// established for `Technology.level` (CLAUDE.md: no skill bars, ever). The
// plain text tag *is* the evidence-linked display: no percentage, no rating.
export function SkillTag({ skill }: SkillTagProps) {
  return <Tag>{skill.name}</Tag>;
}
