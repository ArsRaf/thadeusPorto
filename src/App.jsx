import { useState, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import useIsMobile from './hooks/useIsMobile'
import LoadingScreen from './components/LoadingScreen'
import VolumeGate from './components/VolumeGate'
import FilmStripView from './components/FilmStrip/FilmStripView'
import PortfolioV5 from './components/Portfolio/PortfolioV5'
import FeaturePage from './components/Portfolio/FeaturePage'
import GrainOverlay from './components/Theatre/GrainOverlay'

const TheatreScene = lazy(() => import('./components/Theatre/TheatreScene'))

export default function App() {
  const isMobile = useIsMobile()

  // Mobile skips loading + gate + theatre, lands straight on portfolio
  const [stage, setStage]                 = useState(isMobile ? 'portfolio' : 'loading')
  const [initialVolume, setInitialVolume] = useState(0.2)
  const [selectedProject, setSelectedProject] = useState(null)

  const handleGateEnter = (vol) => {
    setInitialVolume(vol)
    setStage('theatre')
  }

  const handleWorksClick = () => setStage('works')

  return (
    <>
      <GrainOverlay />

      {/* Desktop-only: loading → gate → theatre */}
      {!isMobile && (
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <LoadingScreen key="loading" onComplete={() => setStage('gate')} />
          )}
          {stage === 'gate' && (
            <VolumeGate key="gate" onEnter={handleGateEnter} />
          )}
        </AnimatePresence>
      )}

      {!isMobile && stage !== 'loading' && stage !== 'gate' && (
        <Suspense fallback={null}>
          <TheatreScene
            visible={stage === 'theatre'}
            initialVolume={initialVolume}
            onScreenClick={() => setStage('portfolio')}
          />
        </Suspense>
      )}

      <AnimatePresence>
        {stage === 'portfolio' && (
          <PortfolioV5
            key="portfolio"
            onBack={isMobile ? null : () => setStage('theatre')}
            onSelectProject={setSelectedProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'works' && (
          <FilmStripView
            key="works"
            onBack={() => setStage('portfolio')}
            onSelectProject={setSelectedProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <FeaturePage
            key={'feature-' + selectedProject.id}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onSelectProject={setSelectedProject}
          />
        )}
      </AnimatePresence>
    </>
  )
}
