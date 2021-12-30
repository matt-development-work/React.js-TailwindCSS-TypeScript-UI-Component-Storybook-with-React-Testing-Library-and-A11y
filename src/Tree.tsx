import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface TreeNode {
  children?: NodeList;
  icon?: ReactNode;
  id: number;
  value: string;
}

type NodeList = TreeNode[] | undefined;

interface NodeElementProps {
  node: TreeNode;
}

const NodeElement = forwardRef<HTMLLIElement, NodeElementProps>(
  ({ node }, ref) => {
    const hasChildren: boolean = useMemo(() => 'children' in node, [node]);
    const hasIcon: boolean = useMemo(() => 'icon' in node, [node]);
    const [open, setOpen] = useState(false);
    return (
      <li ref={ref}>
        <div className="flex">
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
                  className={'text-green-400'}
                  icon={faChevronRight}
                  size="sm"
                />
              }
            </i>
          )}
          <p
            className={`text-white hover:text-gray-800 select-none hover:bg-green-100 flex transition ease-in-out duration-75 ml-${
              hasChildren ? '2' : '4'
            } ${hasIcon && 'gap-x-2'}`}
          >
            <i>{node.icon}</i>
            <span>{node['value']}</span>
          </p>
        </div>
        {hasChildren && open && (
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
        {data?.map((n) => (
          <NodeElement key={n['value']} node={n} />
        ))}
      </ul>
    );
  }
);
