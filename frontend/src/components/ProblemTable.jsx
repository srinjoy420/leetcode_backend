import React, { useEffect, useState, useMemo } from 'react'
import { useProblemStore } from '../store/useProblemStore.js'

import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useActionStore } from '../store/useAction.js';
import { usePlayListStore } from '../store/usePlayListStore.js';
import CreatePlaylistModal from './createPlaylistModel.jsx';
import AddToPlaylist from './AddToPlaylist.jsx';



const ProblemTable = ({ problems }) => {
    const { authUser } = useAuthStore()
    const { isDeleating, deleteProblem } = useActionStore()
    const {createPlaylist}=usePlayListStore()
    const [search, setsearch] = useState("")
    const [dificullty, setDifficulty] = useState("ALL")
    const [seletedTag, setselectedTag] = useState("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const [isSolved, setIsSolved] = useState(false)
    const[isCreateModelOpen,setIsCreateModelOpen]=useState(false)
    const[isaddPlaylistModelOpen,setIsaddPlaylistModelOpen]=useState(false)
    const[selectedProblemId,setSelectedProblemId]=useState(null)
    const difficulties = ["EASY", "MEDIUM", "HARD"]
    const allTags = useMemo(() => {
        if (!Array.isArray(problems)) return []
        const tagsSet = new Set()
        problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
        return Array.from(tagsSet)
    }, [problems])
    // all filtered problems
    const filteredProblems = useMemo(() => {
        return (problems || [])
            .filter((problem) =>
                problem.title.toLowerCase().includes(search.toLowerCase())
            )
            .filter((problem) =>
                dificullty === "ALL" ? true : dificullty === problem.difficulty
            )
            .filter((problem) =>
                seletedTag === "ALL" ? true : problem.tags?.includes(seletedTag)
            )
    }, [search, dificullty, seletedTag, problems])
    //pagination'
    const itemsperPage = 5
    const totalPages = Math.ceil(filteredProblems.length / itemsperPage)
    const pagiNateproblem = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsperPage
        const endIndex = startIndex + itemsperPage
        return filteredProblems.slice(startIndex, endIndex)
    }, [filteredProblems, currentPage])

    //handleDelete logic
    const handleDelete = (id) => {
        deleteProblem(id)
    }
    //create playlist
    const createPlaylistHandeler=async(data)=>{
        await createPlaylist(data)
    }
    // add to the playlisty
    const handeladdtoPlaylist=async(problemId)=>{
         setSelectedProblemId(problemId)
         setIsaddPlaylistModelOpen(true)

    }
    return (

        <div className="w-full max-w-6xl mx-auto mt-10">
            {/* div for the buttons */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problems</h2>
                <button
                    className="btn btn-primary gap-2"
                    onClick={() => setIsCreateModelOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    Create Playlist
                </button>
            </div>
            {/* for the filters and tags */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search by title"
                    className="input input-bordered w-full md:w-1/3 bg-base-200"
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                />
                <select
                    className="select select-bordered bg-base-200"
                    value={dificullty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="ALL">All Difficulties</option>
                    {difficulties.map((diff) => (
                        <option key={diff} value={diff}>
                            {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <select
                    className="select select-bordered bg-base-200"
                    value={seletedTag}
                    onChange={(e) => setselectedTag(e.target.value)}
                >
                    <option value="ALL">All Tags</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="table table-zebra table-lg bg-base-200 text-base-content">
                    <thead className="bg-base-300">
                        <tr>
                            <th>Solved</th>
                            <th>Title</th>
                            <th>Tags</th>
                            <th>Difficulty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagiNateproblem.length > 0 ? (
                            pagiNateproblem.map((problem) => {
                                const isSolved = problem.solveBy?.some((user) => user.id === authUser?.id) ?? false;
                                return (
                                    // Your JSX here, e.g:
                                    <tr key={problem.id}>
                                        <td>
                                            <input
                                                type='checkbox'
                                                checked={isSolved}
                                                onChange={() => { }}
                                                readOnly
                                                className="checkbox checkbox-sm"
                                            />
                                        </td>
                                        <td>
                                            <Link to={`/problem/${problem.id}`} className="font-semibold hover:underline">
                                                {problem.title}

                                            </Link>
                                        </td>
                                        {/* the problem tags */}
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags.map((tag, idx) => (
                                                    <span key={idx} className="badge badge-outline badge-warning text-xs font-bold">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        {/* the difficulty */}
                                        <td>
                                            <span className={`badge font-semibold text-xs text-white ${problem.difficulty === "EASY"
                                                ? "badge-success"
                                                : problem.difficulty === "MEDIUM"
                                                    ? "badge-warning"
                                                    : "badge-error"
                                                }`}>
                                                {problem.difficulty.toUpperCase()}

                                            </span>
                                        </td>
                                        {/* the delete button */}
                                        <td>
                                            <div>
                                                {authUser?.role === "ADMIN" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleDelete(problem.id)}
                                                            className="btn btn-sm btn-error"
                                                        >
                                                            <Trash
                                                                className="w-4 h-4"

                                                            />
                                                        </button>
                                                        <button disabled className="btn btn-sm btn-warning">
                                                            <PencilIcon className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                                <button className="btn btn-sm btn-outline flex gap-2 items-center"
                                                onClick={()=>handeladdtoPlaylist(problem.id)}
                                                >
                                                    <Bookmark className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Save to the playlist</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No problems found
                                </td>
                            </tr>
                        )}
                    </tbody>


                </table>

            </div>
            {/* pagination */}
            <div className="flex justify-center mt-6 gap-2">
                <button
                className='btn btn-sm'
                disabled={currentPage===1}
                onClick={()=>setCurrentPage((prev)=>prev-1)}
                >
                    <ArrowLeft />
                    prev
                </button>
                <span className='btn btn-ghosh btn-sm'>
                    {currentPage}/{totalPages}
                </span>
                 <button
                 className='btn btn-sm'
                  disabled={currentPage===totalPages}
                  onClick={()=>setCurrentPage((prev)=>prev+1)}
                 >
                    <ArrowRight />
                    Next
                </button>

            </div>
            {/* models */}
            <CreatePlaylistModal
                isOpen={isCreateModelOpen}
                onClose={() => setIsCreateModelOpen(false)}
                onSubmit={createPlaylistHandeler}
               
            />
            <AddToPlaylist
                isOpen={isaddPlaylistModelOpen}
                onClose={()=>setIsaddPlaylistModelOpen(false)}
                problemId={selectedProblemId}
            />
        </div>

    )
}

export default ProblemTable