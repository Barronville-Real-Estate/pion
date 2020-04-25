// *****************************************************************************
// * Copyright 2020-present Jonathan Barronville <jonathan@re.bville.cc>       *
// *                                                                           *
// * Licensed under the Apache License, Version 2.0 (the "License");           *
// * you may not use this file except in compliance with the License.          *
// * You may obtain a copy of the License at                                   *
// *                                                                           *
// *     http://www.apache.org/licenses/LICENSE-2.0                            *
// *                                                                           *
// * Unless required by applicable law or agreed to in writing, software       *
// * distributed under the License is distributed on an "AS IS" BASIS,         *
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
// * See the License for the specific language governing permissions and       *
// * limitations under the License.                                            *
// *****************************************************************************

'use strict'

require('json5/lib/register')

const jestConfig = require('jest-config')
const os = require('os')
const tsConfigJson = require('./tsconfig.json5')
const tsJestPresets = require('ts-jest/presets')
const tsJestUtils = require('ts-jest/utils')

const { defaults: defaultJestConfiguration } = jestConfig
const { jsWithTs: tsJestConfiguration } = tsJestPresets

const getCpuCoreCount = () => {
  const cpus = os.cpus()
  return cpus.length
}

const getConfiguration = () => {
  const configuration = Object.assign({}, defaultJestConfiguration, tsJestConfiguration, {
    clearMocks: true,
    errorOnDeprecated: true,
    maxConcurrency: getCpuCoreCount(),
    moduleNameMapper: tsJestUtils.pathsToModuleNameMapper(tsConfigJson.compilerOptions.paths, { prefix: '<rootDir>/node_modules/' }),
    notify: true,
    resetMocks: true,
    resetModules: true,
    restoreMocks: true,
    setupFilesAfterEnv: [ 'jest-extended' ],
    testEnvironment: 'node',
    testMatch: [],
    testRegex: 'packages\\/[A-Za-z0-9\\-]+\\/src\\/.*\\.test\\.ts$',
    timers: 'fake'
  })
  delete configuration.testMatch
  return configuration
}

exports = module.exports = getConfiguration()
