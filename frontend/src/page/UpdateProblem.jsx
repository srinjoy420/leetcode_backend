import React, { useEffect } from 'react'
import { useProblemStore } from '../store/useProblemStore.js'
import { Link, useNavigate, useParams } from "react-router-dom"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"


const UpdateProblem = () => {
  const {
    isProblemLoading,
    getProblemByid,
    updateProblem,
    problem
  } = useProblemStore()
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      constraints: "",
      hints: "",
      editorial: "",
    }
  })
  useEffect(() => {
    getProblemByid(id)
  }, [id])

  useEffect(() => {
    if (problem?.id === id) {
      reset({
        title: problem.title ?? "",
        description: problem.description ?? "",
        difficulty: problem.difficulty ?? "EASY",
        constraints: problem.constraints ?? "",
        hints: problem.hints ?? "",
        editorial: problem.editorial ?? "",
      })
    }
  }, [problem, id, reset])

  const onSubmit = async (data) => {
    if (!problem || problem.id !== id) return

    const updateProblemData = {
      title: data.title.trim(),
      description: data.description.trim(),
      difficulty: data.difficulty,
      constraints: data.constraints.trim(),
      hints: data.hints?.trim() || null,
      editorial: data.editorial?.trim() || null,
    }
    const success = await updateProblem(id, updateProblemData)
    if (success) {
      navigate("/")
    }
  }
  if (isProblemLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="card bg-base-200 p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Update Problem</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y4'>
          <input
            {...register("title")}
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
          />
          <textarea
            {...register("description")}
            placeholder="Description"
            className="textarea textarea-bordered w-full"
          />
          <select
            {...register("difficulty")}
            className='select select-bordered w-full"'
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>

          </select>
          <textarea
            {...register("constraints")}
            placeholder="Constraints"
            className="textarea textarea-bordered w-full"
          />
          <textarea
            {...register("hints")}
            placeholder="Hints"
            className="textarea textarea-bordered w-full"
          />
          <textarea
            {...register("editorial")}
            placeholder="Editorial"
            className="textarea textarea-bordered w-full"
          />
          <button className="btn btn-warning w-full" type="submit">
            Update Problem
          </button>

        </form>
      </div>
    </div>
  )
}

export default UpdateProblem