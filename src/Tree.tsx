import React, { forwardRef, HTMLAttributes, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface TreeNode {
  children?: NodeList;
  id: number;
  value: string;
}

type NodeList = TreeNode[];

interface NodeElementProps {
  node: TreeNode;
}

const NodeElement = forwardRef<HTMLLIElement, NodeElementProps>(
  ({ node }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <li ref={ref}>
        <div className="flex">
          {node['children'] && (
            /* 
          TODO:
            1. Allow custom icons to be passed as props.
            2. Move styling parameters to stories file.
           */
            <span
              className={`cursor-pointer ${
                open &&
                'transform rotate-90 transition-transform ease-in-out duration-100'
              }`}
              onClick={() => setOpen(!open)}
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
          <span
            className={`text-white hover:text-gray-800 select-none hover:bg-green-100 transition ease-in-out duration-75 ml-${
              node['children'] ? '2' : '4'
            }`}
          >
            {node['value']}
          </span>
        </div>
        {node['children'] && open && (
          <Tree className={'ml-4'} data={node['children']} />
        )}
      </li>
    );
  }
);

export interface TreeProps extends HTMLAttributes<HTMLUListElement> {
  className: string;
  data: NodeList;
}

export const Tree = forwardRef<HTMLUListElement, TreeProps>(
  ({ className, data }, ref) => {
    return (
      <ul className={`${className} flex flex-col`} ref={ref}>
        {data.map((n) => (
          <NodeElement key={n['value']} node={n} />
        ))}
      </ul>
    );
  }
);
