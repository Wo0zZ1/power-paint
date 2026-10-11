// Тот же градиент, что на обложках областей: пустая доска выглядит как
// задуманная обложка, а не как сломанная картинка.
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
	<defs>
		<linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
			<stop offset="0" stop-color="#2ec4d6"/>
			<stop offset="0.5" stop-color="#f56ddf"/>
			<stop offset="1" stop-color="#ff4545"/>
		</linearGradient>
	</defs>
	<rect width="1600" height="900" fill="url(#g)"/>
</svg>`

export const PREVIEW_PLACEHOLDER = {
	contentType: 'image/svg+xml',
	body: Buffer.from(PLACEHOLDER_SVG),
}
