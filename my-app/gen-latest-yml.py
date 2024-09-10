import os
import json
import hashlib
from datetime import datetime

# Define paths
package_json_path = os.path.join(os.getcwd(), 'package.json')
nupkg_file_template = r'D:\GuoXiaole\XLANG\Electron-forge-auto-update-exp\ElectronForgeAutoUpdate\my-app\out\make\squirrel.windows\x64\my_app_gxlverahku-{version}-full.nupkg'
latest_yml_path = r'D:\GuoXiaole\XLANG\Electron-forge-auto-update-exp\ElectronForgeAutoUpdate\my-app\out\make\squirrel.windows\x64\latest.yml'

# Step 1: Get version from package.json
with open(package_json_path, 'r', encoding='utf-8') as f:
    package_data = json.load(f)
    version = package_data['version']

# Step 2: Generate the full path to the .nupkg file based on the version
nupkg_file = nupkg_file_template.format(version=version)

# Step 3: Calculate the sha512 hash for the .nupkg file
def calculate_sha512(filepath):
    sha512_hash = hashlib.sha512()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha512_hash.update(byte_block)
    return sha512_hash.hexdigest()

sha512_value = calculate_sha512(nupkg_file)

# Step 4: Create the content for the latest.yml file
yml_content = f"""version: {version}
files:
  - url: my_app_gxlverahku-{version}-full.nupkg
    sha512: {sha512_value}
path: my_app_gxlverahku-{version}-full.nupkg
sha512: {sha512_value}
releaseDate: 2024-09-10T01:54:00.000Z
"""

# Step 5: Write the content to latest.yml
with open(latest_yml_path, 'w', encoding='utf-8') as yml_file:
    yml_file.write(yml_content)

print(f'latest.yml file created successfully with version {version} and SHA512 hash.')
