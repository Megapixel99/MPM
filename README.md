# MPM
###### (Package Manager-Package Manager)
MPM is a CLI application (with an API component) written in NodeJS for managing multiple package managers.

## Installation
Download `install.py`, then run the following command in the directory where
`install.py` was downloaded:
```bash
$ python ./install.py
```

## CLI Usage
Install and run a script from the internet
```bash
$ mpm install \       
  script/git@github.com/rubygems/rubygems/master/blob/setup.rb
```
Install one package from one source
```bash
$ mpm install \       
  gem/rails
```
Install multiple packages from one source
```bash
$ mpm install \       
  npm/express,axios
```
Install multiple packages from multiple sources
```bash
$ mpm install \       
  npm/express,axios \
  apt/mysql-server,mysql-client
```
Install one package per source
```bash
$ mpm install \       
  npm/express \
  apt/mysql-server
```

## CLI Options
-s, -silent: no logs wil be output, not even error logs
-v, -verbose: all logs will be output

## Contributing
Please see [`CONTRIBUTING.md`](https://github.com/Megapixel99/MPM/blob/master/CONTRIBUTING.md)

## Known Issues
If you run `build.sh` in zshell, you may receive:
```
zsh compinit: insecure directories and files, run compaudit for list.
Ignore insecure directories and files and continue [y] or abort compinit [n]?
```
If you receive this, please run `build.sh` again and the error will not appear.

## License
```
Copyright 2020 Seth Wheeler

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
