import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface TreeNode {
  children?: TreeNode[];
  icon?: ReactNode;
  id: number;
  value: string;
}

interface NodeElementProps {
  node: TreeNode;
}

const NodeElement = forwardRef<HTMLLIElement, NodeElementProps>(
  ({ node }, ref) => {
    const hasChildren = useMemo<boolean>(() => 'children' in node, [node]);
    const hasIcon = useMemo<boolean>(() => 'icon' in node, [node]);
    const [open, setOpen] = useState<boolean>(false);
    return (
      <li ref={ref}>
        <div
          className={`flex hover:bg-gray-100 hover:bg-opacity-20 px-2 ${
            hasChildren && 'cursor-pointer'
          }`}
          onClick={() => hasChildren && setOpen(!open)}
        >
          {hasChildren && (
            /* 
          TODO:
            1. Move styling parameters to stories file and/or theme.
           */
            <i
              className={`cursor-pointer ${
                open &&
                'transform rotate-90 transition-transform ease-in-out duration-100'
              }`}
              onClick={() => setOpen(!open)}
            >
              {
                <FontAwesomeIcon
                  className={
                    'text-green-400 hover:text-green-500 transition ease-in-out duration-200 mb-px'
                  }
                  icon={faAngleRight}
                  size="sm"
                />
              }
            </i>
          )}
          <p
            className={`text-white select-none flex transition ease-in-out duration-75 px-1 ml-${
              hasChildren ? '1' : '3'
            } ${hasIcon && 'gap-x-2'}`}
          >
            <i className="flex items-center">{node.icon}</i>
            <span className="">{node['value']}</span>
          </p>
        </div>
        {hasChildren && open && (
          <Tree className={'ml-4 border-l border-gray-700'} data={node} />
        )}
      </li>
    );
  }
);

export interface TreeProps extends HTMLAttributes<HTMLUListElement> {
  className: string;
  data: TreeNode;
}

export const Tree = forwardRef<HTMLUListElement, TreeProps>(
  ({ className, data }, ref) => {
    return (
      <ul className={`${className} flex flex-col`} ref={ref}>
        {data.children?.map((n) => (
          <NodeElement key={n['value']} node={n} />
        ))}
      </ul>
    );
  }
);
