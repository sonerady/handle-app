import {useEffect, useRef, useState} from 'react'
import styled from '@emotion/styled'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import Draggable from 'react-draggable'
import {useGlobal} from '../../context/AuthContext'
import {useAPI} from '../../api'
import {v4 as uuidv4} from 'uuid'
import {useAuthService} from '../../services/authService'
import CollectionMenu from '../../pages/Marketplace/components/CollectionMenu'
import {IoMdCloseCircle} from 'react-icons/io'
import styles from './kanban.module.scss'
import {TbTextResize} from 'react-icons/tb'
import {MdOutlineColorLens} from 'react-icons/md'
import {ColorPicker, useColor} from 'react-color-palette'
import 'react-color-palette/lib/css/styles.css'
import {
  HiOutlineArrowSmDown,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmLeft,
  HiOutlineArrowSmRight,
} from 'react-icons/hi'
import {setLocale} from 'yup'
import {BiZoomIn, BiZoomOut} from 'react-icons/bi'
import arrow from '../../../_metronic/assets/icons/arrow.png'

const Container = styled.div`
  display: flex;
`

const TaskList = styled.div`
  min-height: 100px;

  display: flex;
  flex-direction: column;
  border: 2px solid #6c55dc;
  min-width: 380px;
  border-radius: 5px;
  padding: 15px 15px;
  background: #f3f3f3;
  margin-bottom: 10px;
  height: fit-content;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 700px;
`

const TaskColumnStyles = styled.div`
  display: flex;
  width: 100%;
  max-height: 86vh;
  gap: 6rem;
  min-height: 80vh;
`

const Title = styled.span`
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  padding: 2px 10px;
  border-radius: 5px;
  align-self: flex-start;
`

const Kanban = () => {
  const initialColumns = {} // initialize with your default value
  const [columns, setColumns] = useState(initialColumns)
  const {allCollection, imageData, showKanban, accessToken, collection, imageId} = useGlobal()
  const {
    addCollectionList,
    removeCollection,
    getAllCollection,
    removeCollectionItem,
    getCollection,
  } = useAuthService()
  const api = useAPI()
  const [color, setColor] = useColor('hex', '#f3f3f3')
  const [hideColorPicker, setHideColorPicker] = useState(false)

  const initialColors = {} // initialize with your default value
  const [colors, setColors] = useState(initialColors)
  const [sizeConfig, setSizeConfig] = useState(false)
  const [sizeTitle, setSizeTitle] = useState('')
  const [width, setWidth] = useState(320)
  const [height, setHeight] = useState(320)
  const [viewSize, setViewSize] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizedTitle, setResizedTitle] = useState('')
  const [collectionName, setCollectionName] = useState([])
  const initialSizes = () => {
    let savedSizes = localStorage.getItem('sizes')
    if (savedSizes) {
      return JSON.parse(savedSizes)
    } else {
      return {}
    }
  }
  const [sizes, setSizes] = useState(initialSizes)

  const handleLeftClick = (title) => {
    const prevWidth = sizes[title]?.width || 320
    const newWidth = Math.max(prevWidth - 50, 370)
    setSizes((prevSizes) => ({
      ...prevSizes,
      [title]: {
        ...prevSizes[title],
        width: newWidth,
      },
    }))
  }

  const handleRightClick = (title) => {
    const prevWidth = sizes[title]?.width || 320
    const newWidth = Math.min(prevWidth + 50, 720)
    setSizes((prevSizes) => ({
      ...prevSizes,
      [title]: {
        ...prevSizes[title],
        width: newWidth,
      },
    }))
  }

  const handleUpClick = (title) => {
    const prevHeight = sizes[title]?.height || 320
    const newHeight = Math.max(prevHeight - 50, 170)
    setSizes((prevSizes) => ({
      ...prevSizes,
      [title]: {
        ...prevSizes[title],
        height: newHeight,
      },
    }))
  }

  const handleDownClick = (title) => {
    const prevHeight = sizes[title]?.height || 320
    const newHeight = Math.min(prevHeight + 50, 620)
    setSizes((prevSizes) => ({
      ...prevSizes,
      [title]: {
        ...prevSizes[title],
        height: newHeight,
      },
    }))
  }

  useEffect(() => {
    setViewSize(true)
  }, [width, height])

  useEffect(() => {
    localStorage.setItem('sizes', JSON.stringify(sizes))
  }, [sizes])

  // Bileşen yüklendiğinde localStorage'den boyutları almak için
  useEffect(() => {
    const savedSizes = localStorage.getItem('sizes')
    if (savedSizes) {
      setSizes(JSON.parse(savedSizes))
    }
  }, [])

  useEffect(() => {
    if (allCollection && Array.isArray(allCollection)) {
      const initialColors = allCollection.reduce((columns, collection) => {
        if (collection && collection.collectionname && collection.is_active) {
          const newColumnId = uuidv4()
          columns[newColumnId] =
            localStorage.getItem(`${collection.collectionname}_color`) || '#f3f3f3' // or any other default color
        }
        return columns
      }, {})
      setColors(initialColors)
    }
  }, [allCollection])

  const onColorChange = (newColor) => {
    setColor(newColor)
    setColors((prevColors) => ({
      ...prevColors,
      [title]: newColor.hex,
    }))
    localStorage.setItem(`${title}_color`, newColor.hex)
  }

  useEffect(() => {
    let newColumns = {}
    if (imageData) {
      const updatedData = imageData?.datam.map((item, index) => ({
        id: index.toString(),
        image: item,
      }))
      const newColumnId = uuidv4()
      newColumns = {
        [newColumnId]: {
          title: 'Your Images',
          items: updatedData,
        },
      }
    }

    if (allCollection && Array.isArray(allCollection)) {
      newColumns = allCollection.reduce((columns, collection) => {
        if (collection && collection.collectionname && collection.is_active) {
          const newColumnId = uuidv4()
          columns[newColumnId] = {
            title: collection.collectionname,
            items: [],
            id: collection.id,
          }
        }
        return columns
      }, newColumns)
    }

    setColumns(newColumns)
  }, [allCollection, imageData])

  const [collectionId, setCollectionId] = useState('')

  const [photoEffect, setPhotoEffect] = useState(false)

  const onDragEnd = async (result, columns, setColumns) => {
    setZIndex(2) // sürükleme bittiğinde zIndex'i 2 yap
    if (!result.destination) return
    const {source, destination} = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
          prevId: sourceColumn.id, // removed item's previous column id is added to the destination column
        },
      })

      // additional operations here with sourceColumn.id if necessary

      await addCollectionList(destColumn.id, [removed.image])

      // Add to the destination collection
      // If the addition is successful, remove from the source collection
      setPhotoEffect(true)
      await removeCollectionItem(localStorage.getItem(`columnId`), imageId, removed.image)
      await localStorage.setItem(`columnId`, destColumn.id)
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  const [isOnDrag, setIsOnDrag] = useState(false)

  const [zIndex, setZIndex] = useState(2)

  const handleDragStart = () => {
    setZIndex(zIndex + 1)
    setIsResizing(false)
  }

  const [position, setPosition] = useState({x: 0, y: 0})

  const handleDragStop = (title, e, data) => {
    const newPosition = {x: data.x, y: data.y}
    localStorage.setItem(`${title}_lastDraggablePosition`, JSON.stringify(newPosition))
    setPosition(newPosition)

    if (isResizing) {
      setIsResizing(false) // Boyutlandırma işlemi bittiğinde isResizing'i false yap
    }
  }

  const onResizeStart = (title) => {
    setIsResizing(true) // Boyutlandırma başladığında isResizing'i true yap
    setResizedTitle(title) // Hangi sütunun boyutlandırıldığını sakla
  }

  const onResizeStop = () => {
    setIsResizing(false) // Boyutlandırma bittiğinde isResizing'i false yap
  }

  const getPosition = (title) => {
    const storedPosition = localStorage.getItem(`${title}_lastDraggablePosition`)
    return storedPosition ? JSON.parse(storedPosition) : {x: 0, y: 50}
  }

  useEffect(() => {
    getPosition()
  })

  const handleRemoveCollection = async (id) => {
    await removeCollection(id)
    await getAllCollection(accessToken)
  }

  const [title, setTitle] = useState('')

  const handleColorOpen = (title) => {
    setHideColorPicker(!hideColorPicker)
    setTitle(title)
    setSizeConfig(false)
  }

  const handleSizeConfig = (title) => {
    setSizeConfig(!sizeConfig)
    setSizeTitle(title)
    setHideColorPicker(false)
  }

  const invertColor = (hex) => {
    if (!hex) return '#000000' // Default to black if no color is provided

    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1)
    }

    // Convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    if (hex.length !== 6) {
      return '#000000'
    }

    // Inverting color components
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16)
    const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16)
    const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)

    // Pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b)
  }

  const padZero = (str, len) => {
    len = len || 2
    const zeros = new Array(len).join('0')
    return (zeros + str).slice(-len)
  }

  const onDragStart = () => {
    setIsOnDrag(true)
    setZIndex(-1) // sürükleme başladığında zIndex'i -1 yap
  }

  const [deleteCollectionItem, setDeleteCollectionItem] = useState([])

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        await getCollection(accessToken, collectionId)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCollections()
  }, [accessToken])

  const [scale, setScale] = useState(100)

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragEnd={(result) => {
        onDragEnd(result, columns, setColumns)
        setIsOnDrag(false) // Sürükleme işlemi sona erdiğinde, isOnDrag'ı false olarak ayarlayın.
      }}
    >
      {/* <CollectionMenu
      setCollectionName={setCollectionName}
      /> */}
      <div className={styles.scaleButtons}>
        <span
          onClick={() => {
            // scale'yi en fazla 140 olacak şekilde artırıyoruz.
            if (scale < 100) setScale(scale + 10)
          }}
        >
          <BiZoomIn />
        </span>

        {/* Scale değeri zaten yüzde olarak ifade ediliyor. */}
        <p>{scale}%</p>

        <span
          onClick={() => {
            // scale'yi en az 60 olacak şekilde azaltıyoruz.
            if (scale > 40) setScale(scale - 10)
          }}
        >
          <BiZoomOut />
        </span>
      </div>
      <>
        {showKanban && allCollection?.length > 0 ? (
          <Container
            style={{
              // Burada scale değerini 100'e bölerek orijinal scale değerine dönüştürüyoruz.
              transform: `scale(${scale / 100})`,
            }}
          >
            <TaskColumnStyles>
              {Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <Droppable
                    direction={column.title !== 'Your Images' ? 'horizontal' : 'vertical'}
                    key={columnId}
                    droppableId={columnId}
                  >
                    {(provided, snapshot) => (
                      <Draggable
                        style={{
                          background: snapshot.isDraggingOver ? 'red' : 'red',
                        }}
                        onStart={handleDragStart}
                        onStop={(e, data) => handleDragStop(column.title, e, data)}
                        position={getPosition(column.title)}
                        disabled={isOnDrag || column.title === 'Your Images'}
                      >
                        <div
                          style={{
                            height: 'fit-content',
                            position: 'relative',
                            zIndex: column.title !== 'Your Images' && zIndex,
                          }}
                        >
                          {column.title !== 'Your Images' && (
                            <div className={styles.columnTool}>
                              <span
                                style={{
                                  color:
                                    sizeConfig && sizeTitle === column.title ? '#6c55dc' : '#000',
                                }}
                                onClick={() => handleSizeConfig(column.title)}
                              >
                                <TbTextResize />
                              </span>
                              <span
                                style={{
                                  color:
                                    hideColorPicker && title === column.title ? '#6c55dc' : '#000',
                                }}
                                onClick={() => handleColorOpen(column.title)}
                              >
                                <MdOutlineColorLens />
                              </span>
                            </div>
                          )}

                          {title === column.title && hideColorPicker && (
                            <div
                              className={styles.colorPicker}
                              onMouseEnter={() => setIsOnDrag(true)}
                              onMouseLeave={() => setIsOnDrag(false)}
                            >
                              <ColorPicker
                                width={248}
                                height={150}
                                color={color}
                                onChange={onColorChange}
                                hideHSV
                              />
                            </div>
                          )}
                          <div
                            style={{
                              position: 'relative',
                            }}
                          >
                            {column.title !== 'Your Images' && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  width: '95%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Title
                                  style={{
                                    color: invertColor(
                                      localStorage.getItem(`${column.title}_color`) ||
                                        colors[column.title]
                                    ),
                                  }}
                                >
                                  {column.title}
                                </Title>

                                <span
                                  className={styles.closeIcon}
                                  onClick={() => handleRemoveCollection(column.id)}
                                >
                                  <IoMdCloseCircle />
                                </span>
                              </div>
                            )}
                            {column.title === 'Your Images' && (
                              <div>
                                <img className={styles.arrow} src={arrow} alt='arrow' />
                              </div>
                            )}
                            <TaskList
                              style={{
                                paddingTop: column.title === 'Your Images' ? '0px' : '30px',
                                flexDirection: column.title === 'Your Images' ? 'column' : 'row',
                                zIndex: zIndex,
                                border:
                                  column.title !== 'Your Images' &&
                                  isResizing &&
                                  resizedTitle === column.title
                                    ? '2px dashed #00e880'
                                    : column.title !== 'Your Images'
                                    ? '2px solid #6c55dc'
                                    : '1px solid gray',
                                background:
                                  column.title === 'Your Images'
                                    ? 'transparent'
                                    : isResizing && resizedTitle === column.title
                                    ? '#BAFFE0'
                                    : localStorage.getItem(`${column.title}_color`) ||
                                      colors[column.title],
                                width:
                                  column.title !== 'Your Images'
                                    ? `${sizes[column.title]?.width || 320}px`
                                    : 'fit-content',
                                minWidth: column.title === 'Your Images' && '158px',
                                marginTop: column.title === 'Your Images' && '25px',
                                height:
                                  column.title !== 'Your Images'
                                    ? sizes[column.title]?.height
                                      ? `${sizes[column.title]?.height}px`
                                      : 'fit-content'
                                    : '100%',
                                minHeight: column.title !== 'Your Images' && '320px',
                              }}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {column.items.length ? (
                                column.items.map((item, index) => (
                                  <TaskCard
                                    id={column.id}
                                    collectionId={collectionId}
                                    setCollectionId={setCollectionId}
                                    title={column.title}
                                    setPhotoEffect={setPhotoEffect}
                                    photoEffect={photoEffect}
                                    setIsOnDrag={setIsOnDrag}
                                    isOnDrag={isOnDrag}
                                    key={item}
                                    item={item}
                                    index={index}
                                  />
                                ))
                              ) : (
                                <p
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: '#6c55dc',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  No items
                                </p>
                              )}
                              {/* {sizeConfig && column.title !== "Your Images" && (
    <span
      style={{
        position: "absolute",
        right: "0",
        opacity: "0.6",
        bottom: "0",
        margin: "5px 10px",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {`${sizes[column.title]?.width === undefined ?  "370":sizes[column.title]?.width  }x${sizes[column.title]?.height === undefined ?  "370":sizes[column.title]?.height
    }`}
    </span>
  )} */}
                            </TaskList>

                            {sizeConfig && sizeTitle === column.title && (
                              <div
                                className={`${styles.bottomArrow} ${
                                  sizeConfig && sizeTitle === column.title && styles.arrowOther
                                }`}
                              >
                                <p onClick={() => handleUpClick(column.title)}>
                                  <HiOutlineArrowSmUp />
                                </p>
                                <p onClick={() => handleDownClick(column.title)}>
                                  <HiOutlineArrowSmDown />
                                </p>
                              </div>
                            )}
                            {sizeConfig && sizeTitle === column.title && (
                              <div
                                className={`${styles.rightArrow} ${
                                  sizeConfig && sizeTitle === column.title && styles.arrowOther
                                }`}
                              >
                                <p onClick={() => handleLeftClick(column.title)}>
                                  <HiOutlineArrowSmLeft />
                                </p>
                                <p onClick={() => handleRightClick(column.title)}>
                                  <HiOutlineArrowSmRight />
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Draggable>
                    )}
                  </Droppable>
                )
              })}
            </TaskColumnStyles>
          </Container>
        ) : (
          <div></div>
        )}
      </>
    </DragDropContext>
  )
}

export default Kanban
