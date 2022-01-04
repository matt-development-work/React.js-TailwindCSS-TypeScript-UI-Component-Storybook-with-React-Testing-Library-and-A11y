import React, {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface ContextProps {
  data: TreeNode;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleNodeListContainerFocusing: () => void;
  mouseEntered: boolean;
  navigatedId: number;
  nodeListContainerIsFocused: boolean;
  openNodes: number[];
  selectedNode: TreeNode;
  setData: Dispatch<SetStateAction<TreeNode>>;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  setNavigatedId: Dispatch<SetStateAction<number>>;
  setNodeListContainerFocusedState: Dispatch<SetStateAction<boolean>>;
  setSelectedNode: Dispatch<SetStateAction<TreeNode>>;
  toggleNodeOpenState: (id: number, open: boolean) => void;
}

const SelectedNodeContext = createContext({} as ContextProps);

interface ContextWrapperProps {
  children: ReactNode;
}

const SelectedNodeContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [data, setData] = useState<TreeNode>({} as TreeNode);
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [navigatedId, setNavigatedId] = useState<number>(0);
  const [nodeListContainerIsFocused, setNodeListContainerFocusedState] =
    useState<boolean>(false);
  const [openNodes, setOpenNodes] = useState<number[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode>({} as TreeNode);

  useEffect(() => {
    !nodeListContainerIsFocused && setNavigatedId(0);
  }, [nodeListContainerIsFocused]);

  const toggleNodeOpenState = useCallback(
    (id: number, open: boolean): void => {
      const openNodesCopy = [...openNodes];
      switch (open) {
        case true:
          openNodesCopy.splice(openNodesCopy.indexOf(id), 1);
          break;
        case false:
          openNodesCopy.push(id);
          break;
      }
      setOpenNodes(openNodesCopy);
    },
    [openNodes]
  );

  const getNodeAtSpecifiedId = (
    node: TreeNode,
    id: number
  ): TreeNode | null => {
    if (node.id === id) {
      return node;
    } else if (!!node.children) {
      let result = null;
      for (let i = 0; !result && i < node.children.length; i++) {
        result = getNodeAtSpecifiedId(node.children[i], id);
      }
      return result;
    }
    return null;
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const { code } = e;
      if (['Enter', 'Space'].includes(code)) {
        const navigatedNode = getNodeAtSpecifiedId(data, navigatedId);
        if (navigatedId !== selectedNode.id) {
          setSelectedNode(navigatedNode ?? ({} as TreeNode));
        } else {
          setSelectedNode(navigatedNode ?? ({} as TreeNode));
          setNavigatedId(navigatedNode?.id ?? 0);
          children &&
            toggleNodeOpenState(navigatedId, openNodes.includes(navigatedId));
        }
      }
      if (['ArrowUp', 'ArrowDown', 'Tab', 'ShiftLeft'].includes(code)) {
        const nodeListContainer: HTMLElement | null =
          document.getElementById('node-list-0');
        const focusableNodeElements: NodeListOf<Element> | [] =
          nodeListContainer?.querySelectorAll(
            'div, [href], input, [tabindex="0"]'
          ) ?? [];
        const focusableNodeElementsIds: number[] = Array.from(
          focusableNodeElements
        ).map((n) => parseInt(n.id));
        const activeElement: Element | null = document.activeElement;
        const nodeListIncludesActiveElement: false | (() => boolean) =
          activeElement
            ? (): boolean => {
                let focusableNodeElementsArray = Array.from(
                  focusableNodeElements
                );
                focusableNodeElementsArray.pop();
                focusableNodeElementsArray.shift();
                return focusableNodeElementsArray.includes(activeElement);
              }
            : false;
        let selectedIndex: number =
          focusableNodeElementsIds.indexOf(navigatedId) ?? 1;
        switch (code) {
          case 'ArrowUp':
            selectedIndex -= 1;
            break;
          case 'ArrowDown':
            selectedIndex += 1;
            break;
          case 'Tab':
            if (nodeListIncludesActiveElement) {
              selectedIndex = e.shiftKey
                ? selectedIndex - 1
                : selectedIndex + 1;
            } else {
              selectedIndex = e.shiftKey
                ? 0
                : focusableNodeElementsIds.length - 1;
            }
            break;
        }
        const newNavigatedId: number = focusableNodeElementsIds[selectedIndex];
        ['ArrowUp', 'ArrowDown', 'ShiftLeft'].includes(code) &&
          (focusableNodeElements[selectedIndex] as HTMLElement).focus();
        setNavigatedId(newNavigatedId);
      }
    },
    [children, document, navigatedId, open, openNodes, selectedNode, data]
  );

  const handleNodeListContainerFocusing = useCallback((): void => {
    const nodeListContainer: HTMLElement | null =
      document.getElementById('node-list-0');
    const focusableNodeElements: NodeListOf<Element> | [] =
      nodeListContainer?.querySelectorAll(
        'div, [href], input, [tabindex="0"]'
      ) ?? [];
    const focusableNodeElementsIds: number[] = Array.from(
      focusableNodeElements
    ).map((n) => parseInt(n.id));
    const activeElement: Element | null = document.activeElement;
    const activeElementId: number | null =
      activeElement && parseInt(activeElement?.id);
    switch (activeElementId) {
      case 1:
        setNavigatedId(activeElementId);
        break;
      case focusableNodeElementsIds[focusableNodeElementsIds.length - 1]:
        setNavigatedId(activeElementId);
        break;
    }
    setNodeListContainerFocusedState(true);
  }, [data]);

  return (
    <SelectedNodeContext.Provider
      value={{
        data: data,
        handleKeyDown: handleKeyDown,
        handleNodeListContainerFocusing: handleNodeListContainerFocusing,
        mouseEntered: mouseEntered,
        navigatedId: navigatedId,
        nodeListContainerIsFocused: nodeListContainerIsFocused,
        openNodes: openNodes,
        selectedNode: selectedNode,
        setData: setData,
        setMouseEntered: setMouseEntered,
        setNavigatedId: setNavigatedId,
        setNodeListContainerFocusedState: setNodeListContainerFocusedState,
        setSelectedNode: setSelectedNode,
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
  data: TreeNode;
}

const NodeElement: FC<NodeElementProps> = ({ node }) => {
  const {
    mouseEntered,
    navigatedId,
    nodeListContainerIsFocused,
    openNodes,
    selectedNode,
    setNavigatedId,
    setSelectedNode,
    toggleNodeOpenState,
  } = useSelectedNodeContext();

  const children = useMemo<boolean>(() => 'children' in node, [node]);
  const icon = useMemo<boolean>(() => 'icon' in node, [node]);
  const id = useMemo<number>(() => node.id, [node]);
  const open = useMemo<boolean>(
    () => openNodes.includes(id),
    [openNodes, node]
  );
  const selected = useMemo<boolean>(
    () => node === selectedNode,
    [node, selectedNode]
  );
  const navigated = useMemo<boolean>(
    () => id === navigatedId,
    [id, navigatedId]
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

  return (
    <li
      className={
        'hover:bg-gray-100 hover:bg-opacity-10 transition ease-in-out duration-100'
      }
    >
      <div
        className={`flex px-2 focus:outline-none tree-node-focus-visible z-20 ${
          selected &&
          `bg-blue-300 bg-opacity-30 border border-opacity-0 ${
            nodeListContainerIsFocused && 'border-opacity-50 border-blue-400'
          }`
        } ${navigated && 'bg-green-300 bg-opacity-20'}`}
        id={`${id}`}
        onClick={(): void => {
          setSelectedNode(node);
          setNavigatedId(id);
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
          <span>{node.value}</span>
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
    <ul className={`${className} flex flex-col`} id={`node-list-${data.id}`}>
      {data.children?.map((n) => (
        <NodeElement data={data} key={n.value} node={n} />
      ))}
    </ul>
  );
};

export const NodeListContainer: FC<TreeProps> = (props) => {
  const {
    setData,
    setMouseEntered,
    handleKeyDown,
    handleNodeListContainerFocusing,
    setNodeListContainerFocusedState,
  } = useSelectedNodeContext();
  const { data } = props;
  useEffect(() => setData(data), []);
  return (
    <div
      className="cursor-pointer"
      onBlur={(): void => setNodeListContainerFocusedState(false)}
      onFocus={(): void => handleNodeListContainerFocusing()}
      onKeyDown={handleKeyDown}
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
