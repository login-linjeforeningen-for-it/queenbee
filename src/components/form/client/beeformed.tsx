'use client'


import Input from '@components/inputs/input'
import Button from '@components/button/button'
import Select from '@components/inputs/select'
import { useState, useRef, useCallback } from 'react'
import { Copy, GripVertical, Trash2, X } from 'lucide-react'
import Switch from '@components/inputs/switch'


export default function BeeFormedInputsClient({
    defaultValues,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues?: any
}) {


    type QuestionOption = {
        option_text: string
    }
    type Question = {
        question_title: string
        question_description: string
        question_type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'date'
        required: boolean
        position: number
        options: QuestionOption[]
    }

    const [formValues, setFormValues] = useState({
        title: defaultValues?.title ?? '',
        description: defaultValues?.description ?? '',
        capacity: defaultValues?.capacity ?? '',
        open_at: defaultValues?.open_at ?? '',
        close_at: defaultValues?.close_at ?? ''
    })

    const [questions, setQuestions] = useState<Question[]>([])

    function addQuestion() {
        setQuestions([
            ...questions,
            {
                question_title: '',
                question_description: '',
                question_type: 'single_choice',
                required: false,
                position: questions.length + 1,
                options: []
            }
        ])
    }

    function removeQuestion(idx: number) {
        setQuestions(
            questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, position: i + 1 }))
        )
    }

    function updateQuestion(idx: number, field: keyof Question, value: unknown) {
        setQuestions(
            questions.map((q, i) =>
                i === idx ? { ...q, [field]: value } : q
            )
        )
    }

    function addOption(qIdx: number) {
        setQuestions(
            questions.map((q, i) =>
                i === qIdx
                    ? { ...q, options: [...q.options, { option_text: '' }] }
                    : q
            )
        )
    }

    function removeOption(qIdx: number, oIdx: number) {
        setQuestions(
            questions.map((q, i) =>
                i === qIdx
                    ? { ...q, options: q.options.filter((_, j) => j !== oIdx) }
                    : q
            )
        )
    }

    function updateOption(qIdx: number, oIdx: number, value: string | number) {
        setQuestions(
            questions.map((q, i) =>
                i === qIdx
                    ? {
                        ...q,
                        options: q.options.map((opt, j) =>
                            j === oIdx ? { ...opt, option_text: String(value) } : opt
                        )
                    }
                    : q
            )
        )
    }

    const questionTypes = [
        { value: 'single_choice', label: 'Single Choice' },
        { value: 'multiple_choice', label: 'Multiple Choice' },
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'date', label: 'Date' },
    ]

    const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
    const [activeDragIdx, setActiveDragIdx] = useState<number | null>(null)
    const cardRefs = useRef<Array<HTMLDivElement | null>>([])

    function handleDragStart(idx: number) {
        setDraggedIdx(idx)
        setDragOverIdx(idx)
    }

    const handleDragButtonMouseDown = useCallback((idx: number) => {
        setActiveDragIdx(idx)
    }, [])

    function handleDragOver(idx: number, e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (dragOverIdx !== idx) setDragOverIdx(idx)
    }

    function handleDrop() {
        if (draggedIdx === null || dragOverIdx === null) return
        const updated = [...questions]
        const [removed] = updated.splice(draggedIdx, 1)
        updated.splice(dragOverIdx, 0, removed)
        setQuestions(updated.map((q, i) => ({ ...q, position: i + 1 })))
        setDraggedIdx(null)
        setDragOverIdx(null)
    }

    function handleDragEnd() {
        setDraggedIdx(null)
        setDragOverIdx(null)
        setActiveDragIdx(null)
    }

    let renderQuestions = questions
    if (draggedIdx !== null && dragOverIdx !== null && draggedIdx !== dragOverIdx) {
        const temp = [...questions]
        const [removed] = temp.splice(draggedIdx, 1)
        temp.splice(dragOverIdx, 0, removed)
        renderQuestions = temp
    }

    function duplicateQuestion(idx: number) {
        const questionToDuplicate = questions[idx]
        const duplicatedQuestion = {
            ...questionToDuplicate,
            position: questions.length + 1
        }
        setQuestions([...questions, duplicatedQuestion])
    }

    return (
        <div className='flex flex-col gap-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                    name='title'
                    type='text'
                    label='Form Title'
                    value={formValues.title}
                    setValue={(input) => setFormValues({ ...formValues, title: input as string })}
                    required
                />
                <Input
                    name='capacity'
                    type='number'
                    label='Capacity'
                    value={formValues.capacity}
                    setValue={(input) => setFormValues({ ...formValues, capacity: input })}
                />
                <Input
                    name='open_at'
                    type='datetime-local'
                    label='Open At'
                    value={formValues.open_at}
                    setValue={(input) => setFormValues({ ...formValues, open_at: input })}
                />
                <Input
                    name='close_at'
                    type='datetime-local'
                    label='Close At'
                    value={formValues.close_at}
                    setValue={(input) => setFormValues({ ...formValues, close_at: input })}
                />
                <Input
                    name='description'
                    type='text'
                    label='Description'
                    className='col-span-2'
                    value={formValues.description}
                    setValue={(input) => setFormValues({ ...formValues, description: input as string })}
                />
            </div>

            <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>Questions</h2>
                    <Button color='primary' text='Add Question' icon='+' onClick={addQuestion} />
                </div>
                {questions.length === 0 && <div className='text-login-100/80'>No questions yet.</div>}
                {renderQuestions.map((q, renderIdx) => {
                    const origIdx = questions.indexOf(q)
                    return (
                        <div
                            key={origIdx}
                            ref={el => { cardRefs.current[origIdx] = el || null }}
                            className={`border rounded-lg p-4 space-y-3 relative bg-login-800 ${
                                draggedIdx === origIdx ? 'opacity-60' : ''
                            }`}
                            draggable={activeDragIdx === origIdx}
                            onDragStart={() => handleDragStart(origIdx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={e => handleDragOver(renderIdx, e)}
                            onDrop={() => handleDrop()}
                        >
                            <div className='w-full flex justify-between items-center pb-4'>
                                <div>
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        className='group/duplicate p-2 hover:bg-login-500 rounded-md cursor-pointer'
                                        onClick={() => duplicateQuestion(origIdx)}
                                        title='Duplicate question'
                                    >
                                        <Copy className='h-5 w-5 group-hover/duplicate:stroke-login' />
                                    </button>
                                    <button
                                        type='button'
                                        className='group/drag p-2 hover:bg-login-500 rounded-md cursor-grab'
                                        title='Drag to reorder'
                                        onMouseDown={() => handleDragButtonMouseDown(origIdx)}
                                    >
                                        <GripVertical className='h-5 w-5 group-hover/drag:stroke-login' />
                                    </button>
                                    <button
                                        type='button'
                                        className='group/remove p-2 hover:bg-login-500 rounded-md cursor-pointer'
                                        onClick={() => removeQuestion(origIdx)}
                                        title='Remove question'
                                    >
                                        <Trash2 className='h-5 w-5 group-hover/remove:stroke-login' />
                                    </button>
                                </div>
                            </div>
                            <Input
                                name={`question_title_${origIdx}`}
                                type='text'
                                label='Question Title'
                                value={q.question_title}
                                setValue={(input) => updateQuestion(origIdx, 'question_title', input)}
                                required
                            />
                            <Input
                                name={`question_description_${origIdx}`}
                                type='text'
                                label='Question Description'
                                value={q.question_description}
                                setValue={(input) => updateQuestion(origIdx, 'question_description', input)}
                                required
                            />
                            <div className='flex gap-4'>
                                <Select
                                    name={`question_type_${origIdx}`}
                                    label='Type'
                                    value={q.question_type}
                                    setValue={(val) => updateQuestion(origIdx, 'question_type', val)}
                                    options={questionTypes}
                                    required
                                />
                                <label className='flex items-center gap-2'>
                                    <Switch
                                        name={`required_${origIdx}`}
                                        label='Required'
                                        value={q.required}
                                        setValue={(checked: boolean) => updateQuestion(origIdx, 'required', checked)}
                                    />
                                </label>
                            </div>
                            {(q.question_type === 'single_choice' || q.question_type === 'multiple_choice') && (
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-medium'>Options</span>
                                        <Button color='secondary' text='Add Option' icon='+' onClick={() => addOption(origIdx)} />
                                    </div>
                                    {q.options.length === 0 && <div className='text-login-100/80'>No options yet.</div>}
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className='flex gap-2 items-center'>
                                            <Input
                                                name={`option_${origIdx}_${oIdx}`}
                                                type='text'
                                                label={`Option ${oIdx + 1}`}
                                                value={opt.option_text}
                                                setValue={(input) => updateOption(origIdx, oIdx, input as string)}
                                                required
                                            />
                                            <button
                                                type='button'
                                                className='group/remove p-2 hover:bg-login-500 rounded-md cursor-pointer'
                                                onClick={() => removeOption(origIdx, oIdx)}
                                                title='Remove option'
                                            >
                                                <X className='h-5 w-5 group-hover/remove:stroke-red-500/70' />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
