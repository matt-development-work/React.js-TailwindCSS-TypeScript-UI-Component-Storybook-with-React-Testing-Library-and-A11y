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
  setData: Dispatch<SetStateAction<TreeNode>>;
  nodeListContainerIsFocused: boolean;
  setNodeListContainerFocusedState: Dispatch<SetStateAction<boolean>>;
  handleNodeListContainerFocusedState: (focused: boolean) => void;
  mouseEntered: boolean;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  selectedNode: TreeNode;
  setSelectedNode: Dispatch<SetStateAction<TreeNode>>;
  openNodes: number[];
  toggleNodeOpenState: (id: number, open: boolean) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  navigatedId: number;
  setNavigatedId: Dispatch<SetStateAction<number>>;
}

const SelectedNodeContext = createContext({} as ContextProps);

interface ContextWrapperProps {
  children: ReactNode;
}

const SelectedNodeContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [data, setData] = useState<TreeNode>({} as TreeNode);
  const [nodeListContainerIsFocused, setNodeListContainerFocusedState] =
    useState<boolean>(false);
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [openNodes, setOpenNodes] = useState<number[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode>({} as TreeNode);
  const [navigatedId, setNavigatedId] = useState<number>(0);
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

  const getNodeAtSpecifiedId: TreeNode | null = (obj: TreeNode, id: number) => {
    if (obj['id'] == id) {
      return obj;
    } else if (obj['children'] != null) {
      let result = null;
      for (let i = 0; result == null && i < obj['children'].length; i++) {
        result = getNodeAtSpecifiedId(obj['children'][i], id);
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
        if (navigatedId !== selectedNode['id']) {
          setSelectedNode(navigatedNode);
        } else {
          children &&
            toggleNodeOpenState(navigatedId, openNodes.includes(navigatedId));
          setSelectedNode(navigatedNode);
          setNavigatedId(navigatedNode['id']);
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
            ? () => {
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
              if (e.shiftKey) {
                selectedIndex -= 1;
              } else {
                selectedIndex += 1;
              }
            } else {
              if (e.shiftKey) {
                selectedIndex = 0;
              } else {
                selectedIndex = focusableNodeElementsIds.length - 1;
              }
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

  const handleNodeListContainerFocusedState = useCallback(
    (focused: boolean) => {
      setNodeListContainerFocusedState(focused);
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
      const activeElementId: number = parseInt(activeElement?.id);
      switch (activeElementId) {
        case 1:
          setNavigatedId(1);
          break;
        case focusableNodeElementsIds[focusableNodeElementsIds.length - 1]:
          setNavigatedId(
            focusableNodeElementsIds[focusableNodeElementsIds.length - 1]
          );
          break;
      }
    },
    [data]
  );

  return (
    <SelectedNodeContext.Provider
      value={{
        data: data,
        setData: setData,
        nodeListContainerIsFocused: nodeListContainerIsFocused,
        setNodeListContainerFocusedState: setNodeListContainerFocusedState,
        handleNodeListContainerFocusedState:
          handleNodeListContainerFocusedState,
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        mouseEntered: mouseEntered,
        setMouseEntered: setMouseEntered,
        openNodes: openNodes,
        toggleNodeOpenState: toggleNodeOpenState,
        navigatedId: navigatedId,
        setNavigatedId: setNavigatedId,
        handleKeyDown: handleKeyDown,
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
    nodeListContainerIsFocused,
    mouseEntered,
    openNodes,
    selectedNode,
    setSelectedNode,
    toggleNodeOpenState,
    setNavigatedId,
    navigatedId,
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
          `bg-gray-100 bg-opacity-20 border border-opacity-0 ${
            nodeListContainerIsFocused && 'border-opacity-100 border-blue-500'
          }`
        } ${navigated && 'bg-green-300 bg-opacity-50'}`}
        onClick={(): void => {
          setSelectedNode(node);
          setNavigatedId(id);
          children && toggleNodeOpenState(id, open);
        }}
        id={`${id}`}
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
    <ul className={`${className} flex flex-col`} id={`node-list-${data['id']}`}>
      {data.children?.map((n) => (
        <NodeElement key={n['value']} node={n} data={data} />
      ))}
    </ul>
  );
};

export const NodeListContainer: FC<TreeProps> = (props) => {
  const {
    setData,
    setMouseEntered,
    handleKeyDown,
    handleNodeListContainerFocusedState,
  } = useSelectedNodeContext();
  const { data } = props;
  useEffect(() => {
    setData(data);
  }, []);
  return (
    <div
      className="cursor-pointer"
      onFocus={(): void => handleNodeListContainerFocusedState(true)}
      onBlur={(): void => handleNodeListContainerFocusedState(false)}
      onMouseEnter={(): void => setMouseEntered(true)}
      onMouseLeave={(): void => setMouseEntered(false)}
      onKeyDown={(e): void => {
        handleKeyDown(e);
      }}
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
