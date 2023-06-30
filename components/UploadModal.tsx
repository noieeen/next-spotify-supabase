import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";

const UploadMpdal = () => {

    const [isLoading, seiIsLoading] = useState(false)
    const uploadModal = useUploadModal();


    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null
        }
    })

    const onChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {

    }

    return (
        <Modal
            title="Add a song"
            description="Upload an mp3 file"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    id='title'
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id='author'
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <Input
                    id='song'
                    type="file"
                    disabled={isLoading}
                    {...register('song', { required: true })}
                    placeholder="An mp3 file"
                />
                <Input
                    id='image'
                    type="file"
                    disabled={isLoading}
                    {...register('image', { required: true })}
                    placeholder="Song image"
                />
            </form>
        </Modal>
    );
}

export default UploadMpdal;