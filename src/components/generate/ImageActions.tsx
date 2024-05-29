import { FiDownload, FiRefreshCcw, FiTrash, FiZoomIn, FiZoomOut } from "react-icons/fi"
import { A } from "../common/A"
import style from './makeImage.module.css'

interface Props {
    index: number
    url: string
    isProcessing: boolean
    onRebuild: (index: number) => void
    onDelete: (index: number) => void
    onZoom: (index: number) => void
    isZoom: boolean
    isDeleting?: boolean
}

export const ImageActions = ({ index, url, isProcessing, onRebuild, onDelete, onZoom, isZoom, isDeleting }: Props) => {

    return (
        <div className={style.imageBox} >

            <A className={style.downloadButton} onClick={() => {
                window.location.href = (url.replace('upload/', 'upload/fl_attachment:download'))
            }} label={<FiDownload className="size-6" />} />

            {!isProcessing &&
                <A className={style.rebuildButton} onClick={() => onRebuild(index)} label={<FiRefreshCcw className="size-6" />} />
            }

            <A
                className={style.zoomButton}
                onClick={() => onZoom(index)}
                label={isZoom
                    ? <FiZoomOut className="size-6" />
                    : <FiZoomIn className="size-6" />
                }
            />

            {!isDeleting &&
                <A className={style.deleteButton} onClick={() => onDelete(index)} label={<FiTrash className="size-6" />} />
            }
        </div>
    )
}