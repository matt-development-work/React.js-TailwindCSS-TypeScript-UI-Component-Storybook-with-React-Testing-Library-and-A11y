import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface TreeNode {
  id: number;
  value: string;
  children?: NodeList;
}

type NodeList = TreeNode[];

interface NodeItemProps {
  node: TreeNode;
}

const Node = forwardRef<HTMLDivElement, NodeItemProps>(({ node }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <div ref={ref}>
      <div className="flex">
        {node['children'] && (
          /* 
          TODO:
            1. Allow custom icons to be passed as props.
            2. Move styling parameters to stories file.
           */
          <span
            onClick={() => setOpen(!open)}
            className={`cursor-pointer ${
              open &&
              'transform rotate-90 transition-transform ease-in-out duration-100'
            }`}
          >
            {
              <FontAwesomeIcon
                className={'text-green-400'}
                icon={faChevronRight}
                size="sm"
              />
            }
          </span>
        )}
        <li
          className={`text-white hover:text-gray-800 select-none hover:bg-green-100 transition ease-in-out duration-75 ml-${
            node['children'] ? '2' : '4'
          }`}
        >
          {node['value']}
        </li>
      </div>
      <ul className="flex flex-col ml-4">
        {open &&
          node['children']?.map((n) => {
            return <Node node={n} />;
          })}
      </ul>
    </div>
  );
});

export interface TreeProps extends HTMLAttributes<HTMLUListElement> {
  data: NodeList;
}

export const Tree = forwardRef<HTMLUListElement, TreeProps>(({ data }, ref) => {
  return (
    <ul ref={ref} className="flex flex-col">
      {data.map((n) => {
        return <Node node={n} />;
      })}
    </ul>
  );
});
