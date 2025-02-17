import * as React from 'react'
import {FunctionComponent} from 'react'
import {Element, scroller} from 'react-scroll'
import {LessonResource} from 'types'
import {get} from 'lodash'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {bpMinMD, bpMinLG} from 'utils/breakpoints'
import {convertTimeWithTitles} from '../../../utils/time-utils'
import CheckIcon from '../../icons/check-icon'

type NextUpListProps = {
  currentLessonSlug: string
  course: any
  progress: any
}

const CollectionLessonsList: FunctionComponent<NextUpListProps> = ({
  course,
  currentLessonSlug,
  progress,
}) => {
  const {lessons} = course
  const [activeElement, setActiveElement] = React.useState(currentLessonSlug)
  const scrollableNodeRef: any = React.createRef()

  React.useEffect(() => {
    setActiveElement(currentLessonSlug)
    scroller.scrollTo(activeElement, {
      duration: 0,
      delay: 0,
      containerId: 'scroller-container',
    })
  }, [activeElement, setActiveElement, currentLessonSlug])

  return lessons ? (
    <div className="h-full overflow-hidden">
      {/* <span className="font-semibold opacity-80 uppercase text-xs leading-wide">
        Lessons
      </span> */}
      <div className="overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 border-gray-100 h-full rounded-md lg:rounded-none border lg:border-none">
        <ol
          ref={scrollableNodeRef}
          id="scroller-container"
          className="overflow-y-auto h-full"
          css={{
            maxHeight: 300,
            '@media (min-width: 768px)': {
              maxHeight: 350,
            },
            '@media (min-width: 1024px)': {
              maxHeight: '100%',
            },
          }}
        >
          {lessons.map((lesson: LessonResource, index = 0) => {
            const completedLessons = get(progress, 'completed_lessons', []).map(
              (lesson: LessonResource) => lesson.slug,
            )
            const completed =
              lesson.completed || completedLessons.includes(lesson.slug)
            return (
              <li key={lesson.slug}>
                <Element name={lesson.slug} />
                <div>
                  <Item
                    active={lesson.slug === currentLessonSlug}
                    lesson={lesson}
                    index={index}
                    completed={completed}
                    className="hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100"
                  />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  ) : null
}

const Item: FunctionComponent<{
  lesson: any
  active: boolean
  className?: string
  index: number
  completed: boolean
}> = ({lesson, className, index, completed, active = false, ...props}) => {
  const Item = () => (
    <div
      className={`group flex p-3 ${
        active
          ? 'font-semibold bg-blue-600 text-white'
          : 'hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100'
      } transition-colors ease-in-out duration-150`}
      {...props}
    >
      <div className="flex items-start">
        <div
          className={`w-6 leading-5 pt-px text-xs ${
            completed
              ? `opacity-100 ${active ? 'text-white' : 'text-blue-600'}`
              : 'opacity-60 group-hover:opacity-100'
          } font-normal tracking-tight`}
        >
          {completed ? <CheckIcon /> : index + 1}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="w-full leading-tight">{lesson.title} </div>
        <div>
          <span
            className={`${active ? 'text-gray-200' : 'text-gray-500'} text-xs`}
          >
            {convertTimeWithTitles(lesson.duration, {showSeconds: true})}
          </span>
        </div>
      </div>
    </div>
  )
  return active ? (
    <Item />
  ) : (
    <Link href={lesson.path}>
      <a
        onClick={() => {
          track(`clicked next up lesson`, {
            lesson: lesson.slug,
          })
        }}
        className="font-semibold"
      >
        <Item />
      </a>
    </Link>
  )
}

export default CollectionLessonsList
