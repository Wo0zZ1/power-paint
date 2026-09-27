"use client";

import { useTranslations } from "next-intl";
import { Group, Path, Rect, Text } from "react-konva";

import { useInvertableColor } from "@/shared/lib/hooks";
import {
  getBackgroundSizeForCursor,
  getContrastingTextColor,
  getParsedUsername,
} from "@/shared/lib/utils";

import { useBoardPreferences } from "@/widgets/board/model/core/useBoardPreferences";

import { type AwarenessState, useBoardStore } from "../../model";
import { canvasToScreen, screenToCanvas } from "../../model/lib/viewport";

interface UserCursorProps {
  state: AwarenessState;
}

export function UserCursor({ state }: UserCursorProps) {
  const t = useTranslations("guestNameParts");

  const { name, color, id } = state.user;
  const isGuest = id === null;

  const userName = getParsedUsername(name, isGuest, t);

  const { activeColor } = useInvertableColor(color);

  const stage = useBoardStore((s) => s.stage);
  const viewport = useBoardStore((s) => s.viewport);
  const viewportScale = viewport.scale;

  const { showCursors, showOffscreenCursors } = useBoardPreferences();

  if (!showCursors) return null;
  if (!stage) return null;
  if (!state.cursor) return null;

  const [screenX, screenY] = canvasToScreen(
    state.cursor.x,
    state.cursor.y,
    viewport,
  );

  const backgroundSize = getBackgroundSizeForCursor(userName);
  const cursorSize = 20;

  const clampedScreenX = Math.min(
    Math.max(screenX, 0),
    stage.width() - cursorSize,
  );
  const clampedScreenY = Math.min(
    Math.max(screenY, 0),
    stage.height() - cursorSize,
  );

  const isTopEdge = screenY < 0;
  const isRightEdge = screenX > stage.width() - cursorSize - backgroundSize;
  const isBottomEdge = screenY > stage.height() - cursorSize - 30; // 30 is badge height
  const isLeftEdge = screenX < 0;
  const isOffScreen = isTopEdge || isRightEdge || isBottomEdge || isLeftEdge;

  const badgeOffsetX = (isRightEdge ? 1 : -1) * 10;
  const badgeOffsetY = (isBottomEdge ? 1 : -1) * 10;

  const cornerRadius = [14, 14, 14, 14];
  if (isRightEdge && isBottomEdge) cornerRadius[2] = 0;
  else if (isRightEdge) cornerRadius[1] = 0;
  else if (isBottomEdge) cornerRadius[3] = 0;
  else cornerRadius[0] = 0;

  const [renderX, renderY] = screenToCanvas(
    clampedScreenX,
    clampedScreenY,
    viewport,
  );

  const badgeRenderX = 7 - (isRightEdge ? backgroundSize : 0);
  const badgeRenderY = 7 - (isBottomEdge ? 30 : 0);

  if (isOffScreen && !showOffscreenCursors) return null;

  return (
    <Group
      x={renderX}
      y={renderY}
      scaleX={1 / viewportScale}
      scaleY={1 / viewportScale}
      listening={false}
    >
      <Path
        data="M20.5056 10.7754C21.1225 10.5355 21.431 10.4155 21.5176 10.2459C21.5926 10.099 21.5903 9.92446 21.5115 9.77954C21.4205 9.61226 21.109 9.50044 20.486 9.2768L4.59629 3.5728C4.0866 3.38983 3.83175 3.29835 3.66514 3.35605C3.52029 3.40621 3.40645 3.52004 3.35629 3.6649C3.29859 3.8315 3.39008 4.08635 3.57304 4.59605L9.277 20.4858C9.50064 21.1088 9.61246 21.4203 9.77973 21.5113C9.92465 21.5901 10.0991 21.5924 10.2461 21.5174C10.4157 21.4308 10.5356 21.1223 10.7756 20.5054L13.3724 13.8278C13.4194 13.707 13.4429 13.6466 13.4792 13.5957C13.5114 13.5506 13.5508 13.5112 13.5959 13.479C13.6468 13.4427 13.7072 13.4192 13.828 13.3722L20.5056 10.7754Z"
        fill={activeColor}
        stroke="#fff"
        shadowColor="#0006"
        shadowBlur={6}
        strokeWidth={0.5}
        offset={{ x: 3.5, y: 3.5 }} // offset local path
      />
      <Group
        x={badgeRenderX}
        y={badgeRenderY}
        offset={{ x: badgeOffsetX, y: badgeOffsetY }}
      >
        <Rect
          fill={activeColor}
          shadowColor="#0006"
          shadowBlur={6}
          cornerRadius={cornerRadius}
          width={backgroundSize}
          height={30}
        />
        <Text
          align="center"
          text={userName}
          fontSize={12}
          fill={getContrastingTextColor(activeColor)}
          width={backgroundSize}
          lineHeight={30 / 12}
        />
      </Group>
    </Group>
  );
}
