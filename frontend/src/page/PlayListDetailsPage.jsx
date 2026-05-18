import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { usePlayListStore } from '../store/usePlayListStore.js'
import { Loader } from "lucide-react"

const PlayListDetailsPage = () => {

  const { id } = useParams()

  const {
    currentPlayList,
    isLoading,
    getPlaylistDetails
  } = usePlayListStore()

  useEffect(() => {
    getPlaylistDetails(id)
  }, [id])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin size-12 text-primary' />
      </div>
    )
  }

  if (!currentPlayList) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold text-base-content/70'>
          No playlist found
        </h1>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>

      {/* Header */}
      <div className='mb-10'>

        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
          {currentPlayList.name}
        </h1>

        <p className='text-base-content/60 mt-3 text-lg max-w-2xl'>
          {currentPlayList.description}
        </p>

        <div className='mt-5'>
          <span className='badge badge-primary badge-lg'>
            {currentPlayList.problems?.length || 0} Problems
          </span>
        </div>

      </div>

      {/* Problems Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>

        {currentPlayList.problems?.map((item) => (

          <Link
            key={item.problem.id}
            to={`/problem/${item.problem.id}`}
            className='group'
          >

            <div className='
              h-full
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:border-primary/40
            '>

              {/* Top */}
              <div className='flex items-start justify-between gap-4'>

                <h2 className='
                  text-xl
                  font-bold
                  group-hover:text-primary
                  transition-colors
                '>
                  {item.problem.title}
                </h2>

                <span
                  className={`
                    badge text-white font-semibold
                    ${item.problem.difficulty === "EASY"
                      ? "badge-success"
                      : item.problem.difficulty === "MEDIUM"
                        ? "badge-warning"
                        : "badge-error"
                    }
                  `}
                >
                  {item.problem.difficulty}
                </span>

              </div>

              {/* Description */}
              <p className='
                mt-4
                text-sm
                leading-relaxed
                text-base-content/70
                line-clamp-3
              '>
                {item.problem.description}
              </p>

              {/* Footer */}
              <div className='mt-6 flex items-center justify-between'>

                <span className='text-sm text-primary font-medium'>
                  Solve Problem →
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>
  )
}

export default PlayListDetailsPage
// the playlist 