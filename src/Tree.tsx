import React, {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface ContextProps {
  selectedNodeId: number;
  setSelectedNodeId: Dispatch<SetStateAction<number>>;
}

const SelectedNodeContext = createContext({} as ContextProps);

interface ContextWrapperProps {
  children: ReactNode;
}

const SelectedNodeContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<number>(-1);

  return (
    <SelectedNodeContext.Provider
      value={{
        selectedNodeId: selectedNodeId,
        setSelectedNodeId: setSelectedNodeId,
      }}
    >
      {children}
    </SelectedNodeContext.Provider>
  );
};

const useSelectedNodeContext = () => {
  return useContext(SelectedNodeContext);
};

interface TreeNode {
  children?: TreeNode[];
  icon?: ReactNode;
  id: number;
  value: string;
}

interface NodeElementProps {
  node: TreeNode;
}

const NodeElement: FC<NodeElementProps> = ({ node }) => {
  const hasChildren = useMemo<boolean>(() => 'children' in node, [node]);
  const hasIcon = useMemo<boolean>(() => 'icon' in node, [node]);
  const { selectedNodeId, setSelectedNodeId } = useSelectedNodeContext();
  const isSelected = useMemo<boolean>(
    () => node['id'] === selectedNodeId,
    [node, selectedNodeId]
  );
  const [open, setOpen] = useState<boolean>(false);
  return (
    <li>
      <div
        className={`flex hover:bg-gray-100 hover:bg-opacity-20 px-2 ${
          hasChildren && 'cursor-pointer'
        } ${isSelected && 'bg-gray-100 bg-opacity-20'}`}
        onClick={() => {
          setSelectedNodeId(node['id']);
          hasChildren && setOpen(!open);
        }}
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
        <NodeList className={'ml-4 border-l border-gray-700'} data={node} />
      )}
    </li>
  );
};

export interface TreeProps extends HTMLAttributes<HTMLUListElement> {
  className: string;
  data: TreeNode;
}

const NodeList: FC<TreeProps> = ({ className, data }) => {
  return (
    <ul className={`${className} flex flex-col`}>
      {data.children?.map((n) => (
        <NodeElement key={n['value']} node={n} />
      ))}
    </ul>
  );
};

export const Tree: FC<TreeProps> = ({ ...props }) => {
  return (
    <SelectedNodeContextWrapper>
      <NodeList {...props} />
    </SelectedNodeContextWrapper>
  );
};
