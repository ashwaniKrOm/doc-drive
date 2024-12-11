//npm install --save react-dropzone
"use client"
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/actions/file.actions'
import { usePathname } from 'next/navigation'

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {

  const [files, setFiles] = useState<File[]>([]);

  const { toast } = useToast()

  const path = usePathname();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);
// console.log("file set")
    //uploading multiple files at same time
    const uploadPromises = acceptedFiles.map(async (file) => {
      // console.log("enter into acceptedFiles.map")

      //MAX_FILE_SIZE = 50 MB
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))

        //display toast message when file is larger than 50MB
        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>
                {file.name} is too large. Max file size is 50MB
              </span>
            </p>
          ),
          className: "error-toast"
        })
      }

      // console.log("not big sized file")

      await  uploadFile({ file, ownerId, accountId, path })
        .then((uploadedFile) => {
          //when we will get uploadedFile, it means it has completed uploading process and need to be remove from the list of currently uploading file. 
          // console.log("uploadedFile:",uploadedFile)
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name))
          }
        })
    })



    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, filename: string) => {

    //e.stopPropagation() is used to stop an event (like a button click) from reaching its parent elements. It ensures the event only works on the element where it happened
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== filename));

  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt='upload'
          width={24}
          height={24}
        />
        <p>upload</p>
      </Button>

      {/* checking files uploading */}
      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading...</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3'>
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className='preview-item-name'>
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={25}
                      alt='loader'
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={25}
                  height={25}
                  alt='remove'
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />

              </li>
            )
          })}
        </ul>

      )}
      {/* {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      } */}
    </div>
  )
}

export default FileUploader
