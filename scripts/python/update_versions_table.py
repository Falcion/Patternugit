from typing import List, Dict
import json
import os
import subprocess
import yaml

# MIT License
# Copyright (c) Falcion 2023-2024
# Free to share, use or change.

MARKDOWN_FILE = "./../../UNSUPPORTED_VERSIONS.md"
GITHUB_URL = "https://github.com/Falcion/Patternugit/tree/"
MAINTENANCE_STATUS_UNSUPPORTED = "❎"
MAINTENANCE_STATUS_SUPPORTED = "✅"
AUTO_GENERATED_NOTICE = (
    "# THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.\n"
)
ISSUE_TEMPLATE_DIR = "./../../.github/ISSUE_TEMPLATE/"


def get_git_tags() -> List[str]:
    try:
        tags = (
            subprocess.check_output(["git", "tag"])
            .decode("utf-8")
            .strip()
            .split("\n")
        )
        return sorted(tags)
    except subprocess.CalledProcessError:
        print("Error: Unable to retrieve tags from the Git repository.")
        return []


def load_versions_mapping() -> Dict[str, dict]:
    if os.path.exists("./../../versions-mapping.json"):
        with open("./../../versions-mapping.json", "r") as f:
            return json.load(f)
    return {}


def create_markdown_table(
    tags: List[str], versions_mapping: Dict[str, dict]
) -> str:
    table_lines = [AUTO_GENERATED_NOTICE]
    table_lines.append(
        "| Version                                                                 | Maintenance |"
    )
    table_lines.append(
        "|-------------------------------------------------------------------------|-------------|"
    )

    for tag in tags:
        maintenance_status = MAINTENANCE_STATUS_UNSUPPORTED
        version_info = versions_mapping.get(tag, {})

        if version_info:
            status = version_info.get("status", "")
            if status == "supported":
                maintenance_status = MAINTENANCE_STATUS_SUPPORTED
            elif status == "beta":
                maintenance_status = "⚠️"
            elif status == "skipped":
                maintenance_status = "⏭️"

        line = f"| [{tag}]({GITHUB_URL}{tag})            | {maintenance_status}          |"
        table_lines.append(line)

    return "\n".join(table_lines)


def write_markdown_file(content: str) -> None:
    with open(MARKDOWN_FILE, "w", encoding="utf-8") as f:
        f.write(content)


def update_issue_templates(tags: List[str]) -> None:
    if not os.path.exists(ISSUE_TEMPLATE_DIR):
        print(
            f"Warning: Issue template directory {ISSUE_TEMPLATE_DIR} not found."
        )
        return

    for filename in os.listdir(ISSUE_TEMPLATE_DIR):
        filepath = os.path.join(ISSUE_TEMPLATE_DIR, filename)
        if not filename.endswith(".yaml") and not filename.endswith(".yml"):
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            template: dict = yaml.safe_load(f)

        updated = False

        for block in template.get("body", []):
            if (
                block.get("type") == "dropdown"
                and block.get("id") == "version"
            ):
                block["attributes"]["options"] = tags + ["Another or unknown"]
                updated = True
                break

        if updated:
            with open(filepath, "w", encoding="utf-8") as f:
                yaml.dump(template, f, sort_keys=False)
            print(f"Updated {filepath} with new version tags.")


def main() -> int:
    tags = get_git_tags()
    versions_mapping = load_versions_mapping()
    markdown_content = create_markdown_table(tags, versions_mapping)
    write_markdown_file(markdown_content)
    update_issue_templates(tags)
    print(f"Updated {MARKDOWN_FILE} with version information.")

    return 0


if __name__ == "__main__":
    main()
