#!/bin/bash

script_dir=$(dirname "$(readlink -f "$0")")
cd "$script_dir" || exit

package_json=$(<../../package.json)
package_name=$(echo "$package_json" | jq -r '.name')
package_version=$(echo "$package_json" | jq -r '.version')

npm login
npm publish
npm logout

echo "Published $package_name@$package_version to NPM."

cd "$script_dir" || exit
