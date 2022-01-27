import React, {
  createContext,
  createRef,
  Dispatch,
  FC,
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
import './tree.css';

type ContextProps = {
  data: TreeNode;
  confirmSelection: (node: TreeNode, id: number, children: ReactNode) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleContainerFocusing: () => void;
  mouseEntered: boolean;
  navigatedId: number;
  containerIsFocused: boolean;
  openNodes: number[];
  rootListElement: HTMLElement | null;
  selectedNode: TreeNode;
  setData: Dispatch<SetStateAction<TreeNode>>;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  setNavigatedId: Dispatch<SetStateAction<number>>;
  setContainerFocusedState: Dispatch<SetStateAction<boolean>>;
  setRootListElement: Dispatch<SetStateAction<HTMLElement | null>>;
  setSelectedNode: Dispatch<SetStateAction<TreeNode>>;
  toggleNodeOpenState: (id: number, open: boolean) => void;
};

const NodeListContext = createContext({} as ContextProps);

type ContextWrapperProps = {
  children: ReactNode;
};

const NodeListContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
  const [data, setData] = useState<TreeNode>({} as TreeNode);
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [navigatedId, setNavigatedId] = useState<number>(0);
  const [containerIsFocused, setContainerFocusedState] =
    useState<boolean>(false);
  const [openNodes, setOpenNodes] = useState<number[]>([]);
  const [rootListElement, setRootListElement] = useState<HTMLElement | null>(
    null
  );
  const [selectedNode, setSelectedNode] = useState<TreeNode>({} as TreeNode);

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

  const getNodeAtSpecifiedId = useCallback(
    (node: TreeNode, id: number): TreeNode => {
      let result = {} as TreeNode;
      if (node.id === id) {
        return node;
      } else if (!!node.children) {
        for (
          let i = 0;
          !Object.keys(result).length && i < node.children.length;
          i++
        ) {
          result = getNodeAtSpecifiedId(node.children[i], id);
        }
        return result;
      }
      return result;
    },
    []
  );

  const confirmSelection = useCallback(
    (
      node: TreeNode = {} as TreeNode,
      id: number,
      children: ReactNode
    ): void => {
      setSelectedNode(node);
      setNavigatedId(node?.id ?? 0);
      children && toggleNodeOpenState(id, openNodes.includes(id));
    },
    [openNodes]
  );

  type NodeElementUtilities = {
    activeElement: Element | null;
    focusableNodeElements: NodeListOf<Element> | [];
    focusableNodeElementsIds: number[];
  };

  const getNodeElementUtilities = useCallback((): NodeElementUtilities => {
    const focusableNodeElements: NodeListOf<Element> | [] =
      rootListElement?.querySelectorAll('div, [tabindex="0"]') ?? [];
    return {
      activeElement: document.activeElement,
      focusableNodeElements: focusableNodeElements,
      focusableNodeElementsIds: Array.from(focusableNodeElements).map((n) =>
        parseInt(n.id)
      ),
    };
  }, [document, rootListElement]);

  /* When NodeListContainer is already focused, makes a new selection if "Enter" or "Space" keys are pressed,
  or sets the navigatedId and handles NodeElement focusing if navigation keys are pressed. */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const { code } = e;
      if (['Enter', 'Space'].includes(code)) {
        const navigatedNode = getNodeAtSpecifiedId(data, navigatedId);
        if (navigatedId !== selectedNode.id) {
          setSelectedNode(navigatedNode);
        } else {
          confirmSelection(navigatedNode, navigatedId, children);
        }
      } else if (['ArrowUp', 'ArrowDown', 'Tab'].includes(code)) {
        const { focusableNodeElements, focusableNodeElementsIds } =
          getNodeElementUtilities();
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
            selectedIndex = e.shiftKey ? selectedIndex - 1 : selectedIndex + 1;
            break;
        }
        const newNavigatedId: number = focusableNodeElementsIds[selectedIndex];
        ['ArrowUp', 'ArrowDown'].includes(code) &&
          (focusableNodeElements[selectedIndex] as HTMLElement).focus();
        setNavigatedId(newNavigatedId);
      }
    },
    [children, document, navigatedId, open, openNodes, selectedNode, data]
  );

  /* Runs the setNavigatedId method with the appropritae activeElementId onFocus of NodeListContainer.
  This method will handle NodeElement focusing for "Tab" or "Shift+Tab" key input cases where 
  NodeListContainer is not already focused and therefore ignores the handleKeyDown method.
  A NodeListContainer focus invocation with "Tab" will focus the NodeElement of the first index,
  whereas a NodeListContainer focus invocation with "Shift+Tab" will focus the NodeElement of the last index. */
  const handleContainerFocusing = useCallback((): void => {
    const { activeElement, focusableNodeElementsIds } =
      getNodeElementUtilities();
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
    setContainerFocusedState(true);
  }, [data]);

  return (
    <NodeListContext.Provider
      value={{
        confirmSelection: confirmSelection,
        data: data,
        handleKeyDown: handleKeyDown,
        handleContainerFocusing: handleContainerFocusing,
        mouseEntered: mouseEntered,
        navigatedId: navigatedId,
        containerIsFocused: containerIsFocused,
        openNodes: openNodes,
        rootListElement: rootListElement,
        selectedNode: selectedNode,
        setData: setData,
        setMouseEntered: setMouseEntered,
        setNavigatedId: setNavigatedId,
        setContainerFocusedState: setContainerFocusedState,
        setRootListElement: setRootListElement,
        setSelectedNode: setSelectedNode,
        toggleNodeOpenState: toggleNodeOpenState,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
};

const useNodeListContext = () => {
  return useContext(NodeListContext);
};

export type TreeNode = {
  children?: TreeNode[];
  icon?: ReactNode;
  id: number;
  value: string;
};

type NodeElementProps = {
  node: TreeNode;
};

const NodeElement: FC<NodeElementProps> = ({ node }) => {
  const {
    confirmSelection,
    mouseEntered,
    navigatedId,
    containerIsFocused,
    openNodes,
    selectedNode,
    toggleNodeOpenState,
  } = useNodeListContext();
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
        'hover:bg-emerald-600 hover:bg-opacity-20 transition ease-in-out duration-150'
      }
    >
      <div
        className={`flex px-2 focus:outline-none tree-node-focus-visible z-20 border border-opacity-0 hover:border-amber-400 hover:border-opacity-100${
          selected
            ? ` bg-emerald-600 bg-opacity-50 border border-opacity-0${
                containerIsFocused ? ' border-opacity-100 border-lime-400' : ''
              }`
            : ''
        }${navigated ? ' bg-green-300 bg-opacity-20' : ''}`}
        id={`${id}`}
        onClick={(): void => {
          confirmSelection(node, id, children);
        }}
        tabIndex={0}
      >
        {children && (
          /* 
          TODO:
            1. Move all color styling parameters to stories file and/or theme.
           */
          <i
            className={`cursor-pointer${
              open
                ? ' transform rotate-90 transition-transform ease-in-out duration-100'
                : ''
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
          }${icon ? ' gap-x-2' : ''}`}
        >
          <i className="flex items-center">{node.icon}</i>
          <span>{node.value}</span>
        </p>
      </div>
      {children && open && (
        <NodeList
          className={`ml-4 border-l transition ease-in-out duration-150${
            currentDirectory
              ? ' border-gray-200'
              : mouseEntered
              ? ' border-gray-300 border-opacity-30'
              : ' border-opacity-0'
          }`}
          data={node}
        />
      )}
    </li>
  );
};

export type TreeProps = {
  className?: string;
  data: TreeNode;
};

const NodeList: FC<TreeProps> = ({ className, data }) => {
  className = useMemo<string>(
    () => (className ? ` ${className}` : ''),
    [className]
  );
  return (
    <ul className={`flex flex-col${className}`} id={`node-list-${data.id}`}>
      {data.children?.map((n) => (
        <NodeElement key={n.value} node={n} />
      ))}
    </ul>
  );
};

const NodeListContainer: FC<TreeProps> = (props) => {
  const {
    setData,
    setMouseEntered,
    handleKeyDown,
    handleContainerFocusing,
    containerIsFocused,
    setNavigatedId,
    setContainerFocusedState,
    setRootListElement,
  } = useNodeListContext();
  const { data } = props;
  useEffect(() => {
    setData(data);
  }, [data]);
  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (containerRef.current) {
      const rootListElement = containerRef.current?.querySelector(
        '#node-list-0'
      ) as HTMLElement;
      setRootListElement(rootListElement);
    }
  }, [containerRef.current]);
  useEffect(() => {
    if (
      !containerRef.current?.contains(document.activeElement) &&
      !containerIsFocused
    ) {
      setNavigatedId(0);
    }
  }, [containerIsFocused]);
  return (
    <div
      className="cursor-pointer"
      onBlur={(): void => setContainerFocusedState(false)}
      onFocus={handleContainerFocusing}
      onKeyDown={handleKeyDown}
      onMouseEnter={(): void => setMouseEntered(true)}
      onMouseLeave={(): void => setMouseEntered(false)}
      ref={containerRef}
    >
      <NodeList {...props} />
    </div>
  );
};

export const Tree: FC<TreeProps> = (props) => {
  return (
    <NodeListContextWrapper>
      <NodeListContainer {...props} />
    </NodeListContextWrapper>
  );
};
