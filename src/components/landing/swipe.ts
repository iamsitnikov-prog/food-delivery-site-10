// На телефоне длинные сетки карточек превращаются в ленту, которую листают
// пальцем: блок занимает один экран вместо трёх-пяти, следующая карточка
// выглядывает справа и подсказывает, что можно листать. С md и шире — обычная сетка.
export const SWIPE =
  "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0";

export const SWIPE_ITEM = "w-[84%] shrink-0 snap-start md:w-auto md:shrink";
