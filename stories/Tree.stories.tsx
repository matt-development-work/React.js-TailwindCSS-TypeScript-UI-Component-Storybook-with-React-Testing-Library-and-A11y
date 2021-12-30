import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Tree, TreeProps } from '../src/Tree';
import { Card } from '../src/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faFileAlt,
  faFileCode,
  faFlask,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCss3,
  faGitAlt,
  faJsSquare,
  faNpm,
  faReact,
  faYarn,
} from '@fortawesome/free-brands-svg-icons';

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  argTypes: {
    id: { defaultValue: 'tree' },
    title: { defaultValue: 'Tree' },
  },
};

export default meta;

const Template: Story<TreeProps> = (args) => {
  return (
    <div className="absolute h-5/6">
      <Card className="bg-gray-800 px-4 relative max-h-full overflow-y-scroll">
        <Tree {...args} />
      </Card>
    </div>
  );
};

export const Default = Template.bind({});

/* TODO: Refactor and add 'id' attributes. */

Default.args = {
  label: 'Default',
  data: [
    {
      value: 'Root',
      icon: (
        <FontAwesomeIcon icon={faReact} className={'text-blue-400'} size="sm" />
      ),
      children: [
        {
          value: '.storybook',
          icon: (
            <FontAwesomeIcon
              icon={faFolder}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'main.js',
              icon: (
                <FontAwesomeIcon
                  icon={faJsSquare}
                  className={'text-yellow-300'}
                  size="sm"
                />
              ),
            },
            {
              value: 'preview.js',
              icon: (
                <FontAwesomeIcon
                  icon={faJsSquare}
                  className={'text-yellow-300'}
                  size="sm"
                />
              ),
            },
          ],
        },
        {
          value: 'dist',
          icon: (
            <FontAwesomeIcon
              icon={faFolder}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'index.js',
              icon: (
                <FontAwesomeIcon
                  icon={faJsSquare}
                  className={'text-yellow-300'}
                  size="sm"
                />
              ),
            },
          ],
        },
        {
          value: 'components',
          icon: (
            <FontAwesomeIcon
              icon={faFolder}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'Chip',
              icon: (
                <FontAwesomeIcon
                  icon={faFolder}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'chip.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={faCss3}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Chip.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-green-100'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.js',
                  icon: (
                    <FontAwesomeIcon
                      icon={faJsSquare}
                      className={'text-yellow-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'README.md',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },
              ],
            },
            {
              value: 'Drawer',
              icon: (
                <FontAwesomeIcon
                  icon={faFolder}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'drawer.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={faCss3}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Drawer.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-green-100'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.js',
                  icon: (
                    <FontAwesomeIcon
                      icon={faJsSquare}
                      className={'text-yellow-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'README.md',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },
              ],
            },
            {
              value: 'Table',
              icon: (
                <FontAwesomeIcon
                  icon={faFolder}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'table.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={faCss3}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Table.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-green-100'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.js',
                  icon: (
                    <FontAwesomeIcon
                      icon={faJsSquare}
                      className={'text-yellow-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'README.md',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },
              ],
            },
            {
              value: 'TextField',
              icon: (
                <FontAwesomeIcon
                  icon={faFolder}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'textfield.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={faCss3}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'TextField.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-green-100'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.js',
                  icon: (
                    <FontAwesomeIcon
                      icon={faJsSquare}
                      className={'text-yellow-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'README.md',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },
              ],
            },
            {
              value: 'index.js',
              icon: (
                <FontAwesomeIcon
                  icon={faJsSquare}
                  className={'text-yellow-300'}
                  size="sm"
                />
              ),
            },
          ],
        },
        {
          value: 'stories',
          icon: (
            <FontAwesomeIcon
              icon={faFolder}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'Chip.stories.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFileCode}
                  className={'text-green-100'}
                  size="sm"
                />
              ),
            },
            {
              value: 'Drawer.stories.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFileCode}
                  className={'text-green-100'}
                  size="sm"
                />
              ),
            },
            {
              value: 'Table.stories.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFileCode}
                  className={'text-green-100'}
                  size="sm"
                />
              ),
            },
            {
              value: 'TextField.stories.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFileCode}
                  className={'text-green-100'}
                  size="sm"
                />
              ),
            },
          ],
        },
        {
          value: 'styles',
          icon: (
            <FontAwesomeIcon
              icon={faFolder}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'globals.css',
              icon: (
                <FontAwesomeIcon
                  icon={faCss3}
                  className={'text-blue-400'}
                  size="sm"
                />
              ),
            },
          ],
        },
        {
          value: 'test',
          icon: (
            <FontAwesomeIcon
              icon={faFolder}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'Chip.test.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFlask}
                  className={'text-gray-300'}
                  size="sm"
                />
              ),
            },

            {
              value: 'Drawer.test.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFlask}
                  className={'text-gray-300'}
                  size="sm"
                />
              ),
            },
            {
              value: 'Table.test.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFlask}
                  className={'text-gray-300'}
                  size="sm"
                />
              ),
            },
            {
              value: 'TestField.test.tsx',
              icon: (
                <FontAwesomeIcon
                  icon={faFlask}
                  className={'text-gray-300'}
                  size="sm"
                />
              ),
            },
          ],
        },
        {
          value: '.gitignore',
          icon: (
            <FontAwesomeIcon
              icon={faGitAlt}
              className={'text-red-500'}
              size="sm"
            />
          ),
        },
        {
          value: 'package.json',
          icon: (
            <FontAwesomeIcon
              icon={faNpm}
              className={'text-red-500'}
              size="sm"
            />
          ),
        },
        {
          value: 'tailwind.config.js',
          icon: (
            <FontAwesomeIcon
              icon={faFileCode}
              className={'text-green-100'}
              size="sm"
            />
          ),
        },
        {
          value: 'tsconfig.json',
          icon: (
            <FontAwesomeIcon
              icon={faCog}
              className={'text-blue-400'}
              size="sm"
            />
          ),
        },
        {
          value: 'yarn.lock',
          icon: (
            <FontAwesomeIcon
              icon={faYarn}
              className={'text-blue-300'}
              size="sm"
            />
          ),
        },
      ],
    },
  ],
};
