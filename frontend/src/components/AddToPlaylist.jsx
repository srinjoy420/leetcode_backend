import React, { useEffect, useState } from 'react'
import { X } from "lucide-react"
import { usePlayListStore } from '../store/usePlayListStore.js'

const AddToPlaylist = ({ isOpen, onClose, problemId }) => {
    const { isLoading, playlists, getAllPlaylist, probLemaddToPlaylist } = usePlayListStore()
    const [selectedPlaylist, setSelectedPlaylist] = useState("")

    useEffect(() => {
        if (isOpen) {
            getAllPlaylist()
        }
    }, [isOpen])

    const handelSubmit = async (e) => {
        e.preventDefault()
        if (!selectedPlaylist) return
        await probLemaddToPlaylist(selectedPlaylist, [problemId])
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-base-300">
                    <h3 className="text-xl font-bold">Add Problem to Playlist</h3>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>  {/* ✅ onClose */}
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ✅ Form is now INSIDE the modal div */}
                <form onSubmit={handelSubmit} className="p-4">
                    <div className="form-control">
                        <label className="label">  {/* ✅ label not lable */}
                            <span className="label-text font-medium">Select Playlist</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={selectedPlaylist}
                            onChange={(e) => setSelectedPlaylist(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Select Playlist</option>
                            {playlists.map((playlist) => (
                                <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !selectedPlaylist}
                        >
                            Add to Playlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddToPlaylist