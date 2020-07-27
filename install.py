# Licensed under Apache Version 2.0
# Please see the LICENSE file in the root directory of the project for more
# information

import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package, "-q", "-q"])

print ("Downloading latest versions of dependencies")
install("requests")
import platform
import requests
import os
from os.path import expanduser

def make_executable(path):
    mode = os.stat(path).st_mode
    mode |= (mode & 0o444) >> 2
    os.chmod(path, mode)

homeDir = expanduser("~")
system = platform.system()
writeFolder = '/usr/local/mpm/bin'
writeFile = writeFolder + "/mpm"
if system == "Windows":
    print ("Windows is currently not supported, please try again later")
    sys.exit()
if not os.path.exists(writeFolder):
    os.makedirs(writeFolder)
try:
    apiInfo = requests.get("https://api.github.com/repos/Megapixel99/MPM/releases/latest").json()
except requests.exceptions.Timeout:
    print ("A timeout error occured, please try again later")
except requests.exceptions.RequestException as e:
    print ("Unkown error occured")
    raise SystemExit(e)
print ("Downloading version: " + apiInfo["tag_name"])
if system == "Darwin":
    r = requests.get("https://github.com/Megapixel99/MPM/releases/download/" + apiInfo["tag_name"] + "/manager-macos")
    with open(writeFile, 'w+') as f:
        f.write(r.content)
    make_executable(writeFile)
    pass
else:
    r = requests.get("https://github.com/Megapixel99/MPM/releases/download/" + apiInfo["tag_name"] + "/manager-linux")
    with open(writeFile, 'w+') as f:
        f.write(r.content)
    make_executable(writeFile)
    pass

print ("Successfully downloaded version: " + apiInfo["tag_name"])
print ("Please type mpm to begin using the tool")
