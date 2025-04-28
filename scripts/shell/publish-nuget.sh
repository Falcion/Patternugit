#!/bin/bash

# MIT License
# Copyright (c) Falcion 2023-2024
# Free to share, use or change.

# Get the directory of the current script
script_dir=$(dirname "$0")

manifest_path="$script_dir/../../manifest.json"
manifest_content=$(<"$manifest_path")
package_name=$(echo "$manifest_content" | jq -r '.name')
package_version=$(echo "$manifest_content" | jq -r '.version')

env_file_path="$script_dir/../../.env"
api_key=$(grep -oP 'NUGET_API_KEY=\K.*' "$env_file_path")

package_file_path="$script_dir/../../source/$package_name/$package_name.$package_version.nupkg"

nuget_server="https://api.nuget.org/v3/index.json"

nuget pack "./source/$package_name/$package_name.csproj" -Version "$package_version"
nuget push "$package_file_path" -ApiKey "$api_key" -Source "$nuget_server"
