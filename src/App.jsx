import { useState, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import useIsMobile from './hooks/useIsMobile'
import LoadingScreen from './components/LoadingScreen'
import FilmStripView from './components/FilmStrip/FilmStripView'
import ProjectPage from './components/ProjectModal/ProjectPage'
import MobileView from './components/Mobile/MobileView'
import GrainOverlay from './components/Theatre/GrainOverlay'

// Three.js scene is lazy-loaded — mobile users never download it
const TheatreScene = lazy(() => import('./components/Theatre/TheatreScene'))

export default function App() {
  // stage: 'loading' | 'theatre' | 'filmstrip'
  const [stage, setStage] = useState('loading')
  const [selectedProject, setSelectedProject] = useState(null)
  const isMobile = useIsMobile()

  return (
    <>
      <GrainOverlay />

      {/* Loading — shown first, removed on complete */}
      <AnimatePresence mode="wait">
        {stage === 'loading' && (
          <LoadingScreen key="loading" onComplete={() => setStage('theatre')} />
        )}
      </AnimatePresence>

      {isMobile ? (
        stage !== 'loading' && (
          <MobileView onSelectProject={setSelectedProject} />
        )
      ) : (
        <>
          {/* Theatre stays mounted (but invisible) while filmstrip is active
              so that camera state is preserved and reset cleanly */}
          {stage !== 'loading' && (
            <Suspense fallback={null}>
              <TheatreScene
                visible={stage === 'theatre'}
                onScreenClick={() => setStage('filmstrip')}
              />
            </Suspense>
          )}

          <AnimatePresence>
            {stage === 'filmstrip' && (
              <FilmStripView
                key="filmstrip"
                onBack={() => setStage('theatre')}
                onSelectProject={setSelectedProject}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Project page — full-screen, floats above everything */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectPage
            key="project-page"
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
