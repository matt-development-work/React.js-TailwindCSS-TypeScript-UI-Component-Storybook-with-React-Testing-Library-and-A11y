import React, {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface ContextProps {
  nodeListContainerIsFocused: boolean;
  setNodeListContainerFocusedState: Dispatch<SetStateAction<boolean>>;
  mouseEntered: boolean;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  selectedNode: TreeNode;
  setSelectedNode: Dispatch<SetStateAction<TreeNode>>;
  openNodes: number[];
  toggleNodeOpenState: (id: number, open: boolean) => void;
}

const SelectedNodeContext = createContext({} as ContextProps);

interface ContextWrapperProps {
  children: ReactNode;
}

const SelectedNodeContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [nodeListContainerIsFocused, setNodeListContainerFocusedState] =
    useState<boolean>(false);
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [openNodes, setOpenNodes] = useState<number[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode>({} as TreeNode);
  const toggleNodeOpenState = useCallback(
    (id: number, open: boolean): void => {
      const openNodesCopy = [...openNodes];
      switch (open) {
        case true:
          openNodesCopy.splice(openNodesCopy.indexOf(id), 1);
          setOpenNodes(openNodesCopy);
          break;
        case false:
          openNodesCopy.push(id);
          setOpenNodes(openNodesCopy);
          break;
      }
    },
    [openNodes]
  );
  return (
    <SelectedNodeContext.Provider
      value={{
        nodeListContainerIsFocused: nodeListContainerIsFocused,
        setNodeListContainerFocusedState: setNodeListContainerFocusedState,
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        mouseEntered: mouseEntered,
        setMouseEntered: setMouseEntered,
        openNodes: openNodes,
        toggleNodeOpenState: toggleNodeOpenState,
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
  const {
    nodeListContainerIsFocused,
    mouseEntered,
    openNodes,
    selectedNode,
    setSelectedNode,
    toggleNodeOpenState,
  } = useSelectedNodeContext();
  const children = useMemo<boolean>(() => 'children' in node, [node]);
  const icon = useMemo<boolean>(() => 'icon' in node, [node]);
  const id = useMemo<number>(() => node['id'], [node]);
  const open = useMemo<boolean>(
    () => openNodes.includes(id),
    [openNodes, node]
  );
  const selected = useMemo<boolean>(
    () => node === selectedNode,
    [node, selectedNode]
  );
  const currentDirectory = useMemo<boolean>(
    () =>
      /* 
        Returns true if either:
          a. selectedNode has children and is equal to the node prop.
          b. selectedNode does not have children and is a child of the node prop.
      */
      (!!selectedNode?.children && node === selectedNode) ||
      (!selectedNode?.children && node.children?.includes(selectedNode)) ||
      false,
    [node, selectedNode]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (['Enter', 'Space'].includes(e.code)) {
        children && toggleNodeOpenState(id, open);
        setSelectedNode(node);
      }
    },
    [children, id, open, node, selectedNode]
  );
  return (
    <li className="hover:bg-gray-100 hover:bg-opacity-10 transition ease-in-out duration-100">
      <div
        className={`flex px-2 focus:outline-none tree-node-focus-visible ${
          children && 'cursor-pointer'
        } ${
          selected &&
          `bg-gray-100 bg-opacity-20 border border-opacity-0 ${
            nodeListContainerIsFocused && 'border-opacity-100 border-blue-500'
          }`
        }`}
        onKeyDown={(e): void => {
          handleKeyDown(e);
        }}
        onClick={(): void => {
          setSelectedNode(node);
          children && toggleNodeOpenState(id, open);
        }}
        tabIndex={0}
      >
        {children && (
          /* 
          TODO:
            1. Move all color styling parameters to stories file and/or theme.
           */
          <i
            className={`cursor-pointer ${
              open &&
              'transform rotate-90 transition-transform ease-in-out duration-100'
            }`}
            onClick={() => toggleNodeOpenState(id, open)}
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
            children ? '1' : '3'
          } ${icon && 'gap-x-2'}`}
        >
          <i className="flex items-center">{node.icon}</i>
          <span>{node['value']}</span>
        </p>
      </div>
      {children && open && (
        <NodeList
          className={`ml-4 border-l transition ease-in-out duration-150 ${
            currentDirectory
              ? 'border-gray-400'
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

export const NodeListContainer: FC<TreeProps> = (props) => {
  const { setMouseEntered, setNodeListContainerFocusedState } =
    useSelectedNodeContext();
  return (
    <div
      onFocus={(): void => setNodeListContainerFocusedState(true)}
      onBlur={(): void => setNodeListContainerFocusedState(false)}
      onMouseEnter={(): void => setMouseEntered(true)}
      onMouseLeave={(): void => setMouseEntered(false)}
    >
      <NodeList {...props} />
    </div>
  );
};

export const Tree: FC<TreeProps> = (props) => {
  return (
    <SelectedNodeContextWrapper>
      <NodeListContainer {...props} />
    </SelectedNodeContextWrapper>
  );
};
