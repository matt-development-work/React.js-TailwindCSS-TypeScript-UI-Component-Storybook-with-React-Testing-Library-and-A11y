import React, { KeyboardEvent, ReactNode } from 'react';
import { Meta, Story } from '@storybook/react';
import { Tree, TreeNode, TreeProps } from './Tree';
import Card from '../Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
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

interface PreIndexedTreeNode {
  children?: PreIndexedTreeNode[];
  icon?: ReactNode;
  id?: number;
  value: string;
}

const addIdAttributesToTreeNodes = (
  data: PreIndexedTreeNode
): PreIndexedTreeNode | TreeNode => {
  let uniqueId = 0;
  const traverseTreeNodes = (node: PreIndexedTreeNode | TreeNode) => {
    node['id'] = uniqueId;
    uniqueId += 1;
    if (!!node['children']) {
      let result = null;
      for (let i = 0; !result && i < node['children'].length; i++) {
        result = traverseTreeNodes(node['children'][i]);
      }
    }
  };
  traverseTreeNodes(data);
  return data;
};

const treeNodes: PreIndexedTreeNode = {
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
      value: 'src',
      icon: (
        <FontAwesomeIcon
          icon={faFolder}
          className={'text-yellow-200'}
          size="sm"
        />
      ),
      children: [
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
                  value: 'Chip.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
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
                  value: 'Chip.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-300'}
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
                  value: 'Drawer.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-400'}
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
                  value: 'Drawer.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-300'}
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
                  value: 'Table.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-400'}
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
                  value: 'Table.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-300'}
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
                  value: 'TextField.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'TextField.test.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFlask}
                      className={'text-gray-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'TextField.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={faFileCode}
                      className={'text-blue-300'}
                      size="sm"
                    />
                  ),
                },
              ],
            },
          ],
        },
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
      value: '.gitignore',
      icon: (
        <FontAwesomeIcon icon={faGitAlt} className={'text-red-500'} size="sm" />
      ),
    },
    {
      value: 'package.json',
      icon: (
        <FontAwesomeIcon icon={faNpm} className={'text-red-500'} size="sm" />
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
        <FontAwesomeIcon icon={faCog} className={'text-blue-400'} size="sm" />
      ),
    },
    {
      value: 'yarn.lock',
      icon: (
        <FontAwesomeIcon icon={faYarn} className={'text-blue-300'} size="sm" />
      ),
    },
  ],
};

const customTreeData = addIdAttributesToTreeNodes(treeNodes);

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
      <Card
        className="bg-black relative max-h-full overflow-y-scroll shadow-lg"
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>): void => {
          ['ArrowUp', 'ArrowDown', 'Space'].includes(e.code) &&
            e.preventDefault();
        }}
      >
        <Tree {...args} />
      </Card>
    </div>
  );
};

export const Custom = Template.bind({});

Custom.args = {
  data: customTreeData as TreeNode,
};
