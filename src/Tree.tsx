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
  selectedNode: TreeNode | undefined;
  setSelectedNode: Dispatch<SetStateAction<TreeNode | undefined>>;
  mouseEntered: boolean;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
}

const SelectedNodeContext = createContext({} as ContextProps);

interface ContextWrapperProps {
  children: ReactNode;
}

const SelectedNodeContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState<TreeNode | undefined>(
    undefined
  );
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  return (
    <SelectedNodeContext.Provider
      value={{
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        mouseEntered: mouseEntered,
        setMouseEntered: setMouseEntered,
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
  const { selectedNode, setSelectedNode, mouseEntered } =
    useSelectedNodeContext();
  const hasChildren = useMemo<boolean>(() => 'children' in node, [node]);
  const nodeAndChildrenAreWithinSelectedScope = useMemo<boolean | undefined>(
    () =>
      (!!selectedNode?.children && node.id === selectedNode?.id) ||
      (!selectedNode?.children &&
        node.children?.map((n) => n.id).includes(selectedNode?.id || NaN)),
    [selectedNode]
  );
  const hasIcon = useMemo<boolean>(() => 'icon' in node, [node]);
  const isSelected = useMemo<boolean>(
    () => node.id === selectedNode?.id,
    [node, selectedNode]
  );
  const [open, setOpen] = useState<boolean>(false);
  return (
    <li className="hover:bg-gray-100 hover:bg-opacity-10 transition ease-in-out duration-100">
      <div
        className={`flex px-2 ${hasChildren && 'cursor-pointer'} ${
          isSelected && 'bg-gray-100 bg-opacity-20'
        }`}
        onClick={() => {
          setSelectedNode(node);
          hasChildren && setOpen(!open);
        }}
      >
        {hasChildren && (
          /* 
          TODO:
            1. Move all color styling parameters to stories file and/or theme.
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
          <span>{node['value']}</span>
        </p>
      </div>
      {hasChildren && open && (
        <NodeList
          className={`ml-4 border-l transition ease-in-out duration-150 ${
            nodeAndChildrenAreWithinSelectedScope
              ? 'border-gray-500'
              : mouseEntered
              ? 'border-gray-500 border-opacity-50'
              : 'border-opacity-0'
          }`}
          data={node}
        />
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

export const NodeListContainer: FC<TreeProps> = ({ ...props }) => {
  const { setMouseEntered } = useSelectedNodeContext();
  return (
    <div
      onMouseEnter={(): void => setMouseEntered(true)}
      onMouseLeave={(): void => setMouseEntered(false)}
    >
      <NodeList {...props} />
    </div>
  );
};

export const Tree: FC<TreeProps> = ({ ...props }) => {
  return (
    <SelectedNodeContextWrapper>
      <NodeListContainer {...props} />
    </SelectedNodeContextWrapper>
  );
};
