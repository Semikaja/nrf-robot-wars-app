import style from 'app/pages/Game.module.css'
import { Field } from 'components/Game/Field'
import { Robot } from 'components/Game/Robot'
import { useGameAdmin } from 'hooks/useGameAdmin'
import { useGameController } from 'hooks/useGameController'
import { useEffect, useState } from 'react'

const randomColor = () =>
	`#${Math.floor(Math.random() * 16777215)
		.toString(16)
		.padEnd(6, '0')}`

type RobotFieldConfig = Record<
	string,
	{
		xMm: number
		yMm: number
		colorHex: string
		rotationDeg: number
	}
>

export const Admin = () => {
	const fieldWidthMm = 1500
	const fieldHeightMm = 1000
	const startZoneSizeMm = 100
	const robotWidthMM = 65
	const robotLengthMm = 90

	const {
		metaData: { robotFieldPosition },
		setRobotPosition,
	} = useGameAdmin()

	const { gameState } = useGameController()

	const [robots, setRobots] = useState<RobotFieldConfig>({})
	const [selectedRobot, setSelectedRobot] = useState<string>()

	useEffect(() => {
		const defaultRobotConfig: RobotFieldConfig = {}
		for (const robot of Object.values(gameState.robots)) {
			defaultRobotConfig[robot.mac] = {
				xMm: robotFieldPosition[robot.mac]?.xMm ?? Math.random() * fieldWidthMm,
				yMm:
					robotFieldPosition[robot.mac]?.yMm ?? Math.random() * fieldHeightMm,
				colorHex: randomColor(),
				rotationDeg: robot.angleDeg ?? 0,
			}
		}
		setRobots(defaultRobotConfig)
	}, [gameState, robotFieldPosition])

	return (
		<div className={style.field}>
			<Field
				heightMm={fieldHeightMm}
				widthMm={fieldWidthMm}
				numberOfHelperLines={3}
				startZoneSizeMm={startZoneSizeMm}
				onClick={({ xMm, yMm }) => {
					console.log('Clicked on field', { xMm, yMm })
					if (selectedRobot !== undefined) {
						setSelectedRobot(undefined)
						setRobots((robots) => ({
							...robots,
							[selectedRobot]: {
								...robots[selectedRobot],
								xMm,
								yMm,
							},
						}))
						setRobotPosition(selectedRobot, { xMm, yMm })
					}
				}}
			>
				{Object.entries(robots).map(
					([mac, { xMm, yMm, colorHex, rotationDeg }]) => (
						<Robot
							key={mac}
							id={mac}
							xMm={xMm}
							yMm={yMm}
							widthMm={robotWidthMM}
							heightMm={robotLengthMm}
							colorHex={colorHex}
							outline={
								selectedRobot !== undefined && selectedRobot !== mac
									? true
									: false
							}
							rotationDeg={rotationDeg}
							onRotate={(rotation) => {
								setRobots((robots) => ({
									...robots,
									[mac]: {
										...robots[mac],
										rotationDeg: rotationDeg + rotation,
									},
								}))
							}}
							onClick={() => {
								console.log('Clicked on robot', mac)
								setSelectedRobot(mac)
							}}
						/>
					),
				)}
			</Field>
			<form
				onSubmit={(e) => {
					e.preventDefault()
				}}
			>
				<button
					className="btn btn-secondary"
					type="button"
					disabled={selectedRobot === undefined}
					onClick={() => {
						setSelectedRobot(undefined)
					}}
				>
					cancel
				</button>
			</form>
		</div>
	)
}
