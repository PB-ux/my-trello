function dndColumns() {
  let currentDroppable = null;
  let placeholder;
  let isDraggingStarted = false;
  let movingElement;

  const createPlaceholder = () => {
    const movingElementHeight = movingElement.getBoundingClientRect().height;
    placeholder = document.createElement("div");
    placeholder.classList.add("placeholder-column");
    placeholder.style.height = movingElementHeight;
    movingElement.parentNode.insertBefore(placeholder, movingElement);
  };

  const onMouseMove = (event) => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;
      createPlaceholder();
      Object.assign(movingElement.style, {
        position: "absolute",
        zIndex: 1000,
        left: `${initialMovingElementPageXY.x}px`,
        top: `${initialMovingElementPageXY.y}px`,
      });
    }
    moveAt(movingElement, event.pageX, event.pageY);

    elementBelow = getElementBelow(movingElement, "by-top");
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest(".column");
    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        if (!isRight(movingElement, currentDroppable)) {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable
          );
        } else {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable.nextElementSibling
          );
        }
      }
    }
  };

  const setMovingElement = (event) => {
    movingElement = event.target.closest(".column");
  };

  const onMouseUp = () => {
    if (!isDraggingStarted) {
      document.removeEventListener("mousemove", onMouseMove);
      movingElement.onmouseup = null;
      return;
    }

    placeholder.parentNode.insertBefore(movingElement, placeholder);
    Object.assign(movingElement.style, {
      position: "static",
      left: "auto",
      top: "auto",
      zIndex: "auto",
      transform: "none",
    });
    document.removeEventListener("mousemove", onMouseMove);
    isDraggingStarted = false;
    placeholder && placeholder.parentNode.removeChild(placeholder);
    movingElement.onmouseup = null;
    movingElement = null;
  };

  const onMouseDown = (event) => {
    setMovingElement(event);
    initialHeight = movingElement.getBoundingClientRect().height;
    shifts.set(event.clientX, event.clientY, movingElement);
    initialMovingElementPageXY.set(movingElement);
    document.addEventListener("mousemove", onMouseMove);
    movingElement.onmouseup = onMouseUp;
  };

  for (const draggableElement of document.querySelectorAll(
    ".board-column-header"
  )) {
    console.log(draggableElement);
    draggableElement.onmousedown = onMouseDown;
    draggableElement.ondragstart = () => {
      return false;
    };
  }
}
dndColumns();

function addColumn() {
  const createBtn = document.querySelector(".header__btn");
  const board = document.querySelector(".board");
  const columnHTML = `
  <div class="column">
  <div class="board-column-header" draggable contenteditable="true">
    Введите название
  </div>
  <div class="board-column-content-wrapper">
    <div class="board-item item1" draggable>
      <div class="board-item-content">
      Стартовая карточка<i class="uil uil-trash-alt"></i>
      </div>
    </div>

    <div class="board-form">
      <textarea
        class="board-form__textarea"
        placeholder="Введите название карточки"
      ></textarea>
      <div class="board-form__buttons">
        <button class="board-form__btn-add">Добавить карточку</button>
        <a class="board-form__btn-cancel"
          ><i class="uil uil-times"></i
        ></a>
      </div>
    </div>

    <button class="board__btn">
      <i class="uil uil-plus"></i>Добавить карточку
    </button>
  </div>
</div>
  `;
  createBtn.addEventListener("click", (e) => {
    board.insertAdjacentHTML("beforeend", columnHTML);
    dndColumns();
    dndTickets();
    addTicket();
    deleteTicket();
    changeTitle();
  });
}
addColumn();

function changeTitle() {
  const titles = document.querySelectorAll(".board-column-header");

  titles.forEach((title) => {
    title.addEventListener("click", (e) => {
      selectElementContents(e.target);
    });
  });
}
changeTitle();

function selectElementContents(el) {
  let range = document.createRange();
  range.selectNodeContents(el);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
