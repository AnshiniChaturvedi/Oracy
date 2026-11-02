import re

ROLE_SKILLS = {
    "data analyst": {
        "python", "sql", "excel", "power bi",
        "tableau", "statistics", "pandas"
    },
    "python developer": {
        "python", "git", "rest api",
        "fastapi", "django", "sql"
    },
    "software developer": {
        "java", "python", "dsa",
        "git", "sql", "rest api"
    },
    "machine learning engineer": {
        "python", "pandas", "numpy",
        "scikit-learn", "machine learning",
        "statistics", "sql"
    },
    "frontend developer": {
        "html", "css", "javascript",
        "react", "typescript", "git"
    },
}

SKILL_ALIASES = {
    "powerbi": "power bi",
    "scikit learn": "scikit-learn",
    "scikit-learn": "scikit-learn",
    "js": "javascript",
    "dsa": "dsa",
    "restful api": "rest api",
}


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9+#.\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def extract_skills(resume_text: str) -> list[str]:
    text = normalize_text(resume_text)
    found = set()

    all_skills = set()
    for skills in ROLE_SKILLS.values():
        all_skills.update(skills)

    for skill in all_skills:
        pattern = (
            r"(?<![a-z0-9+#.])"
            + re.escape(skill)
            + r"(?![a-z0-9+#.])"
        )

        if re.search(pattern, text):
            found.add(skill)

    # Normalize common alternate spellings.
    for alias, canonical in SKILL_ALIASES.items():
        pattern = (
            r"(?<![a-z0-9+#.])"
            + re.escape(alias)
            + r"(?![a-z0-9+#.])"
        )
        if re.search(pattern, text):
            found.add(canonical)

    return sorted(found)


def compare_role(
    extracted_skills: list[str],
    target_role: str,
) -> dict:
    role_key = normalize_text(target_role)

    if role_key not in ROLE_SKILLS:
        return {
            "supported_role": False,
            "message": (
                "Role requirements are not configured yet."
            ),
        }

    required = ROLE_SKILLS[role_key]
    resume_skills = set(extracted_skills)

    matched = sorted(resume_skills & required)
    missing = sorted(required - resume_skills)

    score = round(
        len(matched) / len(required) * 100
    ) if required else 0

    return {
        "supported_role": True,
        "target_role": target_role,
        "match_score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "extracted_skills": extracted_skills,
    }


def suggest_roles(
    extracted_skills: list[str],
    target_role: str,
) -> list[dict]:
    resume_skills = set(extracted_skills)
    target_key = normalize_text(target_role)

    suggestions = []

    for role, required in ROLE_SKILLS.items():
        if role == target_key:
            continue

        matched = sorted(resume_skills & required)
        score = round(
            len(matched) / len(required) * 100
        ) if required else 0

        if matched:
            suggestions.append({
                "role": role.title(),
                "match_score": score,
                "matched_skills": matched,
            })

    return sorted(
        suggestions,
        key=lambda item: item["match_score"],
        reverse=True,
    )[:3]
