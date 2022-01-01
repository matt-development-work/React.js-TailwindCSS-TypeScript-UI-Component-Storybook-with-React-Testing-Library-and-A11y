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
  mouseEntered: boolean;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  selectedNode: TreeNode | undefined;
  setSelectedNode: Dispatch<SetStateAction<TreeNode | undefined>>;
  openedNodes: number[];
  toggleNodeOpenState: (id: number, open: boolean) => void;
}

const SelectedNodeContext = createContext({} as ContextProps);

interface ContextWrapperProps {
  children: ReactNode;
}

const SelectedNodeContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [openedNodes, setOpenedNodes] = useState<number[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | undefined>(
    undefined
  );
  const toggleNodeOpenState = useCallback(
    (id: number, open: boolean): void => {
      const openedNodesCopy = [...openedNodes];
      switch (open) {
        case true:
          openedNodesCopy.splice(openedNodesCopy.indexOf(id), 1);
          setOpenedNodes(openedNodesCopy);
          break;
        case false:
          openedNodesCopy.push(id);
          setOpenedNodes(openedNodesCopy);
          break;
      }
    },
    [openedNodes]
  );
  return (
    <SelectedNodeContext.Provider
      value={{
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        mouseEntered: mouseEntered,
        setMouseEntered: setMouseEntered,
        openedNodes: openedNodes,
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
    selectedNode,
    setSelectedNode,
    mouseEntered,
    openedNodes,
    toggleNodeOpenState,
  } = useSelectedNodeContext();
  const hasChildren = useMemo<boolean>(() => 'children' in node, [node]);
  const hasIcon = useMemo<boolean>(() => 'icon' in node, [node]);
  const isOpen = useMemo<boolean>(
    () => openedNodes.includes(node['id']),
    [openedNodes, node]
  );
  const isSelected = useMemo<boolean>(
    () => node.id === selectedNode?.id,
    [node, selectedNode]
  );
  const nodeAndChildrenAreWithinSelectedScope = useMemo<boolean | undefined>(
    () =>
      (!!selectedNode?.children && node.id === selectedNode?.id) ||
      (!selectedNode?.children &&
        node.children?.map((n) => n.id).includes(selectedNode?.id || NaN)),
    [node, selectedNode]
  );
  return (
    <li className="hover:bg-gray-100 hover:bg-opacity-10 transition ease-in-out duration-100">
      <div
        className={`flex px-2 ${hasChildren && 'cursor-pointer'} ${
          isSelected && 'bg-gray-100 bg-opacity-20'
        }`}
        onClick={() => {
          setSelectedNode(node);
          hasChildren && toggleNodeOpenState(node['id'], isOpen);
        }}
      >
        {hasChildren && (
          /* 
          TODO:
            1. Move all color styling parameters to stories file and/or theme.
           */
          <i
            className={`cursor-pointer ${
              isOpen &&
              'transform rotate-90 transition-transform ease-in-out duration-100'
            }`}
            onClick={() => toggleNodeOpenState(node['id'], isOpen)}
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
      {hasChildren && isOpen && (
        <NodeList
          className={`ml-4 border-l transition ease-in-out duration-150 ${
            nodeAndChildrenAreWithinSelectedScope
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
