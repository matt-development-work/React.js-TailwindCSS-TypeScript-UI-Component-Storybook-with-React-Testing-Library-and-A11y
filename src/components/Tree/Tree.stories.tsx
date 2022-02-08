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
  faYarn,
} from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const gearIcon = faCog as IconProp;
const fileCodeIcon = faFileCode as IconProp;
const flaskIcon = faFlask as IconProp;
const folderIcon = faFolder as IconProp;
const cssIcon = faCss3 as IconProp;
const gitIcon = faGitAlt as IconProp;
const jsIcon = faJsSquare as IconProp;
const npmIcon = faNpm as IconProp;
const yarnIcon = faYarn as IconProp;

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  argTypes: {
    id: { defaultValue: 'tree' },
    title: { defaultValue: 'Tree' },
  },
};

export default meta;

type PreIndexedTreeNode = {
  children?: PreIndexedTreeNode[];
  icon?: ReactNode;
  id?: number;
  value: string;
};

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

let customTreeNodeData: PreIndexedTreeNode | TreeNode = {
  value: 'Root',
  children: [
    {
      value: '.storybook',
      icon: (
        <FontAwesomeIcon
          icon={folderIcon}
          className={'text-yellow-200'}
          size="sm"
        />
      ),
      children: [
        {
          value: 'main.js',
          icon: (
            <FontAwesomeIcon
              icon={jsIcon}
              className={'text-yellow-300'}
              size="sm"
            />
          ),
        },
        {
          value: 'preview.js',
          icon: (
            <FontAwesomeIcon
              icon={jsIcon}
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
          icon={folderIcon}
          className={'text-yellow-200'}
          size="sm"
        />
      ),
      children: [
        {
          value: 'index.js',
          icon: (
            <FontAwesomeIcon
              icon={jsIcon}
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
          icon={folderIcon}
          className={'text-yellow-200'}
          size="sm"
        />
      ),
      children: [
        {
          value: 'components',
          icon: (
            <FontAwesomeIcon
              icon={folderIcon}
              className={'text-yellow-200'}
              size="sm"
            />
          ),
          children: [
            {
              value: 'Chip',
              icon: (
                <FontAwesomeIcon
                  icon={folderIcon}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'chip.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={cssIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Chip.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Chip.test.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={flaskIcon}
                      className={'text-gray-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Chip.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
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
                  icon={folderIcon}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'drawer.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={cssIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Drawer.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Drawer.test.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={flaskIcon}
                      className={'text-gray-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Drawer.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-200'}
                      size="sm"
                    />
                  ),
                },

                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
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
                  icon={folderIcon}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'table.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={cssIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Table.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Table.test.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={flaskIcon}
                      className={'text-gray-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'Table.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
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
                  icon={folderIcon}
                  className={'text-yellow-200'}
                  size="sm"
                />
              ),
              children: [
                {
                  value: 'index.ts',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'textfield.css',
                  icon: (
                    <FontAwesomeIcon
                      icon={cssIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'TextField.stories.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-400'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'TextField.test.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={flaskIcon}
                      className={'text-gray-300'}
                      size="sm"
                    />
                  ),
                },
                {
                  value: 'TextField.tsx',
                  icon: (
                    <FontAwesomeIcon
                      icon={fileCodeIcon}
                      className={'text-blue-200'}
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
              icon={cssIcon}
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
        <FontAwesomeIcon icon={gitIcon} className={'text-red-500'} size="sm" />
      ),
    },
    {
      value: 'package.json',
      icon: (
        <FontAwesomeIcon icon={npmIcon} className={'text-red-500'} size="sm" />
      ),
    },
    {
      value: 'tailwind.config.js',
      icon: (
        <FontAwesomeIcon
          icon={fileCodeIcon}
          className={'text-green-100'}
          size="sm"
        />
      ),
    },
    {
      value: 'tsconfig.json',
      icon: (
        <FontAwesomeIcon
          icon={gearIcon}
          className={'text-blue-400'}
          size="sm"
        />
      ),
    },
    {
      value: 'yarn.lock',
      icon: (
        <FontAwesomeIcon
          icon={yarnIcon}
          className={'text-blue-300'}
          size="sm"
        />
      ),
    },
  ],
};

customTreeNodeData = addIdAttributesToTreeNodes(customTreeNodeData);

const Template: Story<TreeProps> = (args) => {
  return (
    <div className="absolute h-5/6">
      <Card
        className="bg-black relative max-h-full overflow-y-scroll border hover:border-green-300 pr-5"
        hoverElevation="xl"
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
  data: customTreeNodeData as TreeNode,
};
