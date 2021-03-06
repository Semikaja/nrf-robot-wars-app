import Color from 'color'
import styles from 'components/Game/Robot.module.css'
import { nanoid } from 'nanoid'

export const Robot = ({
	id,
	xMm,
	yMm,
	widthMm,
	heightMm,
	rotationDeg,
	colorHex,
	onRotate,
	onClick,
	outline,
}: {
	id: string
	xMm: number
	yMm: number
	widthMm: number
	heightMm: number
	rotationDeg: number
	colorHex: string
	onRotate: (rotateDeg: number) => void
	onClick?: () => void
	outline?: boolean
}) => {
	// Construct points for a triangle.
	const points: [number, number][] = []
	// First point centered tip
	points.push([xMm, yMm - heightMm / 2])
	// Left corner
	points.push([xMm - widthMm / 2, yMm + heightMm / 2])
	// Right corner
	points.push([xMm + widthMm / 2, yMm + heightMm / 2])

	const gradientId = nanoid()

	return (
		<g>
			<defs>
				<linearGradient id={gradientId} gradientTransform="rotate(90)">
					<stop
						style={{
							stopColor: colorHex,
							stopOpacity: 1,
						}}
						offset={1}
					/>
					<stop
						style={{
							stopColor: Color(colorHex).darken(0.5).string(),
							stopOpacity: 1,
						}}
						offset={0}
					/>
				</linearGradient>
			</defs>
			<g transform={`rotate(${rotationDeg}, ${xMm}, ${yMm})`}>
				<polygon
					style={
						outline ?? false
							? {
									fill: `none`,
									stroke: colorHex,
									strokeWidth: 4,
							  }
							: {
									fill: `url(#${gradientId})`,
									fillOpacity: 1,
									stroke: 'none',
							  }
					}
					points={points.map((pointDef) => pointDef.join(',')).join(' ')}
					onWheel={(e) => {
						e.stopPropagation()
						onRotate(e.deltaY > 0 ? 5 : -5)
					}}
					onClick={(e) => {
						e.stopPropagation()
						onClick?.()
					}}
				/>
			</g>
			<text
				x={points[2][0] - widthMm / 2}
				y={points[2][1] - heightMm / 2}
				className={styles.label}
				dominantBaseline="middle"
				textAnchor="middle"
			>
				{id}
			</text>
		</g>
	)
}
