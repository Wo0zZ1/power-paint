import type {
	CircleElementType,
	DrawElementType,
	ElementType,
	RectElementType,
	TextElementType,
} from '../model/types'

type Rectangle = {
	x: number
	y: number
	width: number
	height: number
}

type Point = {
	x: number
	y: number
}

const ELLIPSE_SAMPLES = 48
const EPSILON = 0.001

const normalizeRect = (rect: Rectangle): Rectangle => {
	const right = rect.x + rect.width
	const bottom = rect.y + rect.height

	return {
		x: Math.min(rect.x, right),
		y: Math.min(rect.y, bottom),
		width: Math.abs(rect.width),
		height: Math.abs(rect.height),
	}
}

const degToRad = (deg: number) => (deg * Math.PI) / 180

const rotatePoint = (point: Point, angleRad: number): Point => {
	const cos = Math.cos(angleRad)
	const sin = Math.sin(angleRad)

	return {
		x: point.x * cos - point.y * sin,
		y: point.x * sin + point.y * cos,
	}
}

const isPointInsideRect = (rect: Rectangle, point: Point): boolean => {
	const normalizedRect = normalizeRect(rect)

	return (
		point.x >= normalizedRect.x - EPSILON &&
		point.x <= normalizedRect.x + normalizedRect.width + EPSILON &&
		point.y >= normalizedRect.y - EPSILON &&
		point.y <= normalizedRect.y + normalizedRect.height + EPSILON
	)
}

const getRectCornerPoints = (element: RectElementType): Point[] => {
	const width = element.width
	const height = element.height
	const angleRad = degToRad(element.rotation)

	const corners: Point[] = [
		{ x: 0, y: 0 },
		{ x: width, y: 0 },
		{ x: width, y: height },
		{ x: 0, y: height },
	]

	return corners.map(corner => {
		const rotated = rotatePoint(corner, angleRad)
		return {
			x: element.x + rotated.x,
			y: element.y + rotated.y,
		}
	})
}

const getEllipseContourPoints = (element: CircleElementType): Point[] => {
	const angleRad = degToRad(element.rotation)
	const rx = element.width / 2
	const ry = element.height / 2

	const cx = element.width / 2
	const cy = element.height / 2

	return Array.from({ length: ELLIPSE_SAMPLES }, (_, i) => {
		const t = (i / ELLIPSE_SAMPLES) * Math.PI * 2
		const localPoint: Point = {
			x: cx + Math.cos(t) * rx,
			y: cy + Math.sin(t) * ry,
		}
		const rotated = rotatePoint(localPoint, angleRad)

		return {
			x: element.x + rotated.x,
			y: element.y + rotated.y,
		}
	})
}

const getStrokePoints = (element: DrawElementType): Point[] => {
	const angleRad = degToRad(element.rotation)
	const points: Point[] = []

	for (let i = 0; i < element.points.length; i += 2) {
		const localPoint: Point = {
			x: element.points[i],
			y: element.points[i + 1],
		}
		const rotated = rotatePoint(localPoint, angleRad)
		points.push({
			x: element.x + rotated.x,
			y: element.y + rotated.y,
		})
	}

	return points
}

const getTextCornerPoints = (element: TextElementType): Point[] => {
	const width = element.width
	const height = element.height

	const angleRad = degToRad(element.rotation)

	const corners: Point[] = [
		{ x: 0, y: 0 },
		{ x: width, y: 0 },
		{ x: width, y: height },
		{ x: 0, y: height },
	]

	return corners.map(corner => {
		const rotated = rotatePoint(corner, angleRad)
		return {
			x: element.x + rotated.x,
			y: element.y + rotated.y,
		}
	})
}

export const isElementFullyInsideRect = (
	selectionRect: Rectangle,
	element: ElementType,
): boolean => {
	switch (element.type) {
		case 'rect':
			const corners = getRectCornerPoints(element)
			return corners.every(point => isPointInsideRect(selectionRect, point))
		case 'circle':
			const contour = getEllipseContourPoints(element)
			return contour.every(point => isPointInsideRect(selectionRect, point))
		case 'draw':
			const points = getStrokePoints(element)
			return points.every(point => isPointInsideRect(selectionRect, point))
		case 'text':
			const textCorners = getTextCornerPoints(element)
			return textCorners.every(point => isPointInsideRect(selectionRect, point))
		default:
			const _: never = element
			return _
	}
}
