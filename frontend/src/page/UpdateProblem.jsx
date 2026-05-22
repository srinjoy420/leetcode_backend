import React from 'react'
import { useProblemStore } from '../store/useProblemStore.js'
import {Link} from "react-router-dom"
import {Loader} from "lucide-react"

const UpdateProblem = () => {
  const{}=useProblemStore()
  return (
    <div>UpdateProblem</div>
  )
}

export default UpdateProblem