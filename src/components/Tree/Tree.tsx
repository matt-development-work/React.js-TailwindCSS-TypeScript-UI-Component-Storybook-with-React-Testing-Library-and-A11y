import React, {
  createContext,
  createRef,
  Dispatch,
  FC,
  KeyboardEvent,
  MouseEvent,
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
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './tree.css';

type ContextProps = {
  confirmSelection: (node: TreeNode, canFocus?: boolean) => void;
  containerIsFocused: boolean;
  data: TreeNode;
  focusedNodeId: number;
  getNodeAtSpecifiedId: (node: TreeNode, id: number) => TreeNode;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleSetOpenNodeIds: (id: number, open: boolean) => void;
  mouseEntered: boolean;
  openNodeIds: number[];
  rootListElement: HTMLElement | null;
  focusedNode: TreeNode;
  setContainerFocusedState: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<TreeNode>>;
  setFocusedNodeId: Dispatch<SetStateAction<number>>;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  setRootListElement: Dispatch<SetStateAction<HTMLElement | null>>;
  setFocusedNode: Dispatch<SetStateAction<TreeNode>>;
};

const NodeListContext = createContext<ContextProps>({} as ContextProps);

const NodeListContextWrapper: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<TreeNode>({} as TreeNode);
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [focusedNodeId, setFocusedNodeId] = useState<number>(0);
  const [containerIsFocused, setContainerFocusedState] =
    useState<boolean>(false);
  const [openNodeIds, setOpenNodeIds] = useState<number[]>([]);
  const [rootListElement, setRootListElement] =
    useState<HTMLElement | null>(null);
  const [focusedNode, setFocusedNode] = useState<TreeNode>({} as TreeNode);

  /**
   * Updates the openNodeIds array to correspond with the indexes of the currently-opened node elements when the open state of a node with children is changed.
   * @param {number} id Id of the node being toggled
   * @param {boolean} open New open state of the toggled node
   * @returns {void}
   */
  const handleSetOpenNodeIds = useCallback(
    (id: number, open: boolean): void => {
      const openNodeIdsCopy = [...openNodeIds];
      switch (open) {
        case true:
          openNodeIdsCopy.splice(openNodeIdsCopy.indexOf(id), 1);
          break;
        case false:
          openNodeIdsCopy.push(id);
          break;
      }
      setOpenNodeIds(openNodeIdsCopy);
    },
    [openNodeIds]
  );

  /**
   * Traverses a tree to find the node with a specified ID.
   * @param {TreeNode} node Root-level data
   * @param {number} id Number to be matched
   * @returns {TreeNode} Node at specified ID, matching the structure of the root node provided
   */
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

  /**
   * Handles node element selection on click or keyDown of "Space" or "Enter" keys.
   * @param {TreeNode} node React component to be selected
   * @param {boolean} canToggle Specifies if the open state of the new selected node changes upon being focused
   * @returns {void}
   */
  const confirmSelection = useCallback(
    (node: TreeNode = {} as TreeNode, canToggle = true): void => {
      const { id } = node;
      setFocusedNode(node);
      canToggle &&
        'children' in node &&
        handleSetOpenNodeIds(id, openNodeIds.includes(id));
    },
    [openNodeIds]
  );

  type NodeElementFocusingUtilities = {
    activeElement: Element | null;
    focusableNodeElements: NodeListOf<Element> | [];
    focusableNodeElementsIds: number[];
  };

  /**
   * Returns HTML-derived variables used within the node element focusing methodology.
   * @returns {NodeElementFocusingUtilities}
   */
  const getNodeElementFocusingUtilities =
    useCallback((): NodeElementFocusingUtilities => {
      const focusableNodeElements: NodeListOf<Element> | [] =
        rootListElement?.querySelectorAll('li') ?? [];
      return {
        activeElement: document.activeElement,
        focusableNodeElements: focusableNodeElements,
        focusableNodeElementsIds: Array.from(focusableNodeElements).map((n) =>
          parseInt(n.id)
        ),
      };
    }, [document, rootListElement]);

  /**
   * When NodeListContainer is already focused, makes a new selection if "Enter" or "Space" keys are pressed,
     or sets the focusedNodeId and handles NodeElement focusing if navigation keys are pressed.
   * @param {KeyboardEvent} e Keyboard event
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const { key } = e;
      if (['ArrowLeft', 'ArrowRight'].includes(key)) {
        const { id } = focusedNode;
        const open: boolean = openNodeIds.includes(id);
        /* LeftArrow: 
            When focus is on an open node, closes the node.
            When focus is on a child node, moves focus to its parent node.
          */
        if (key === 'ArrowLeft') {
          if (open) {
            confirmSelection(focusedNode);
            return;
          }
          const {
            activeElement,
            focusableNodeElements,
            focusableNodeElementsIds,
          } = getNodeElementFocusingUtilities();
          for (let i = focusableNodeElementsIds.indexOf(id) - 1; i > -1; i--) {
            if (
              focusableNodeElements[i]?.contains(activeElement as HTMLLIElement)
            ) {
              const parentID: number = parseInt(focusableNodeElements[i].id);
              const parentNode: TreeNode = getNodeAtSpecifiedId(data, parentID);
              confirmSelection(parentNode, false);
              return;
            }
          }
        }
        /* RightArrow: 
            When focus is on a closed node, opens the node; focus does not move.
            When focus is on a open node, moves focus to the first child node.
          */
        if (key === 'ArrowRight' && 'children' in focusedNode) {
          if (!open) {
            confirmSelection(focusedNode);
          } else {
            const { focusableNodeElementsIds } =
              getNodeElementFocusingUtilities();
            let selectedIndex: number = focusableNodeElementsIds.indexOf(
              focusedNode.id
            );
            const nextFocusableNode: TreeNode = getNodeAtSpecifiedId(
              focusedNode,
              focusableNodeElementsIds[selectedIndex + 1]
            );
            confirmSelection(nextFocusableNode, false);
          }
        }
      }
      if (['Enter', 'Space'].includes(key)) {
        const navigatedNode: TreeNode = getNodeAtSpecifiedId(
          data,
          focusedNode.id
        );
        confirmSelection(navigatedNode);
      } else if (['ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
        const { focusableNodeElementsIds } = getNodeElementFocusingUtilities();
        let selectedIndex: number =
          focusableNodeElementsIds.indexOf(focusedNode.id) ?? 1;
        switch (key) {
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
        const newfocusedNodeId: number =
          focusableNodeElementsIds[selectedIndex];
        /* Return if navigating direction has no subsequent navigable elements.
        (i.e. if attempting to navigate upwards from a currently-selected first element,
        or if attempting to navigate downwards from a currently-selected last element.) */
        if (!newfocusedNodeId && key !== 'Tab') return;
        const nextFocusableNode: TreeNode = getNodeAtSpecifiedId(
          data,
          newfocusedNodeId
        );
        confirmSelection(nextFocusableNode, false);
      }
    },
    [children, document, open, openNodeIds, focusedNode, data]
  );

  return (
    <NodeListContext.Provider
      value={{
        confirmSelection: confirmSelection,
        containerIsFocused: containerIsFocused,
        data: data,
        focusedNodeId: focusedNodeId,
        getNodeAtSpecifiedId: getNodeAtSpecifiedId,
        handleKeyDown: handleKeyDown,
        handleSetOpenNodeIds: handleSetOpenNodeIds,
        mouseEntered: mouseEntered,
        openNodeIds: openNodeIds,
        rootListElement: rootListElement,
        focusedNode: focusedNode,
        setContainerFocusedState: setContainerFocusedState,
        setData: setData,
        setFocusedNodeId: setFocusedNodeId,
        setMouseEntered: setMouseEntered,
        setRootListElement: setRootListElement,
        setFocusedNode: setFocusedNode,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
};

const useNodeListContext = () => useContext(NodeListContext);

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
  const { confirmSelection, mouseEntered, openNodeIds, focusedNode } =
    useNodeListContext();
  const { id } = node;
  const children = useMemo<boolean>(() => 'children' in node, [node]);
  const icon = useMemo<boolean>(() => 'icon' in node, [node]);
  const open = useMemo<boolean>(
    () => openNodeIds.includes(id),
    [openNodeIds, node]
  );
  const focused = useMemo<boolean>(
    () => id === focusedNode.id,
    [id, focusedNode]
  );
  const currentDirectory = useMemo<boolean>(
    () =>
      /* 
        Returns true if either:
          a. selectedNode has children and is equal to the node prop.
          b. selectedNode does not have children and is a child of the node prop.
      */
      (!!focusedNode?.children && node === focusedNode) ||
      (!focusedNode?.children && node.children?.includes(focusedNode)) ||
      false,
    [node, focusedNode]
  );
  return (
    <li
      aria-expanded={open}
      className={
        'hover:bg-emerald-600 hover:bg-opacity-20 transition ease-in-out duration-150'
      }
      id={`${id}`}
      onClick={(e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>): void => {
        e.stopPropagation();
      }}
      role="treeitem"
      tabIndex={-1}
    >
      <span
        className={`flex px-2 focus:outline-none z-20 border border-opacity-0 ${
          !focused
            ? ` hover:bg-emerald-600 hover:bg-opacity-40 hover:border-amber-400 hover:border-opacity-100`
            : ` bg-emerald-600 bg-opacity-50 border border-opacity-100 border-lime-400`
        }`}
        onClick={(): void => {
          confirmSelection(node);
        }}
      >
        {children && (
          /* 
          TODO:
            1. Move all all non-component-specific styling parameters to stories file and/or theme.
           */
          <i
            className={
              open
                ? 'transform rotate-90 transition-transform ease-in-out duration-100'
                : ''
            }
          >
            {
              <FontAwesomeIcon
                className={
                  'text-green-400 hover:text-green-500 transition ease-in-out duration-200'
                }
                icon={faAngleRight as IconProp}
                size="sm"
              />
            }
          </i>
        )}
        <span
          className={`text-white select-none flex transition ease-in-out duration-75 px-1 ml-${
            children ? '1' : '3'
          }${icon ? ' gap-x-2' : ''}`}
        >
          <i className="flex items-center">{node.icon}</i>
          <span>{node.value}</span>
        </span>
      </span>
      {children && open && (
        <NodeList
          /* Displays left vertical rulers as applicable. */
          className={`ml-4 border-l transition ease-in-out duration-150${
            currentDirectory
              ? ' border-gray-200'
              : mouseEntered
              ? ' border-gray-300 border-opacity-30'
              : ' border-opacity-0'
          }`}
          data={node}
          role="group"
        />
      )}
    </li>
  );
};

export type TreeProps = {
  className?: string;
  data: TreeNode;
  role?: string;
};

const NodeList: FC<TreeProps> = ({ className, data, role = 'tree' }) => {
  const { id, children } = data;
  className = useMemo<string>(
    () => (className ? ` ${className}` : ''),
    [className]
  );
  return (
    <ul
      className={`flex flex-col${className}`}
      id={`node-list-${id}`}
      role={role}
    >
      {children?.map((n) => (
        <NodeElement key={n.value} node={n} />
      ))}
    </ul>
  );
};

const NodeListContainer: FC<TreeProps> = (props) => {
  const {
    focusedNode,
    handleKeyDown,
    setData,
    setMouseEntered,
    setRootListElement,
  } = useNodeListContext();
  const { data } = props;
  useEffect(() => {
    setData(data);
  }, [data]);
  const containerRef = createRef<HTMLDivElement>();
  /* Sets the rootListElement used for selecting the DOM elements that are eligible for focusing with keyboard navigation. 
  NOTE: containerRef.current is passed to the dependency array to require the callback to re-run on update in case
  the .current value of the containerRef (the <div/> element) is not recognized the first time. */
  useEffect(() => {
    if (containerRef.current) {
      const rootElement = containerRef.current?.querySelector(
        '#node-list-0'
      ) as HTMLElement;
      const firstFocusableElement: HTMLLIElement = rootElement?.querySelector(
        'li'
      ) as HTMLLIElement;
      firstFocusableElement.setAttribute('tabindex', '0');
      setRootListElement(rootElement);
    }
  }, [containerRef.current]);
  /* Switches the tabindex to 0 on the element in the process of being focused. */
  useEffect(() => {
    const nextFocusableElement = containerRef.current?.querySelector(
      `[id='${focusedNode.id}']`
    ) as HTMLLIElement;
    nextFocusableElement?.setAttribute('tabindex', '0');
    nextFocusableElement?.focus();
  }, [focusedNode]);
  return (
    <div
      className="cursor-pointer"
      onBlur={(): void => {
        /* Enables roving tab index behavior when container loses focus. 
          TODO: Element tabindex should be reset to -1 upon setting a new element tabindex to 0.
        */
        const zeroTabIndexNodes = containerRef.current?.querySelectorAll(
          `[tabindex='0']`
        ) as NodeListOf<HTMLLIElement>;
        for (let i = 0; i < zeroTabIndexNodes?.length; i++) {
          if (zeroTabIndexNodes[i].id !== focusedNode.id.toString()) {
            zeroTabIndexNodes[i]?.setAttribute('tabindex', '-1');
          }
        }
      }}
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
