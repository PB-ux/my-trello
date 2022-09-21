function dndTickets() {
  let currentDroppable = null;
  let placeholder;
  let isDraggingStarted = false;
  let movingElement;

  const processEmptySections = () => {
    document
      .querySelectorAll(".board-column-content-wrapper")
      .forEach((section) => {
        if (section.querySelector(".board-item.emptySectionHiddenLesson")) {
          const emptySectionHiddenLesson = section.querySelector(
            ".emptySectionHiddenLesson"
          );
          emptySectionHiddenLesson &&
            section.removeChild(emptySectionHiddenLesson);
        }
        if (
          !section.querySelector(".board-item:not(.emptySectionHiddenLesson)")
        ) {
          const emptySectionHiddenLesson = document.createElement("div");
          emptySectionHiddenLesson.classList.add(
            "board-item",
            "emptySectionHiddenLesson"
          );
          const form = section.querySelector(".board-form");
          section.insertBefore(emptySectionHiddenLesson, form);
        } else {
          const emptySectionHiddenLesson = section.querySelector(
            ".emptySectionHiddenLesson"
          );
          emptySectionHiddenLesson &&
            section.removeChild(emptySectionHiddenLesson);
        }
      });
  };

  const createPlaceholder = () => {
    placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");
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

    elementBelow = getElementBelow(movingElement, "by-center");
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest(".board-item");

    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        if (
          !isAbove(movingElement, currentDroppable) ||
          currentDroppable.classList.contains("emptySectionHiddenLesson")
        ) {
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
    movingElement = event.target.closest(".board-item");
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

    processEmptySections();
  };

  const onMouseDown = (event) => {
    setMovingElement(event);
    shifts.set(event.clientX, event.clientY, movingElement);
    initialMovingElementPageXY.set(movingElement);
    document.addEventListener("mousemove", onMouseMove);
    movingElement.onmouseup = onMouseUp;
  };

  for (const draggableElement of document.querySelectorAll(".board-item")) {
    draggableElement.onmousedown = onMouseDown;
    draggableElement.ondragstart = () => {
      return false;
    };
  }
}
dndTickets();

function addTicket() {
  const addTicketBtns = document.querySelectorAll(".board-form__btn-add");
  showFormTicket();
  cancelFormTicket();
  addTicketBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const column = btn.closest(".column");
      const form = column.querySelector(".board-form");
      const textarea = column.querySelector(".board-form__textarea");
      const ticket = column.querySelectorAll(".board-item");
      const lastTicket = ticket[ticket.length - 1];
      if (ticket.length) {
        if (textarea.value) {
          const newItem = `
          <div class="board-item item1" draggable>
            <div class="board-item-content">
              ${textarea.value} <i class="uil uil-trash-alt"></i>
            </div>
          </div>
          `;
          lastTicket.insertAdjacentHTML("afterend", newItem);
          textarea.value = "";
          textarea.focus();
          dndTickets();
          deleteTicket();
        }
      } else {
        if (textarea.value) {
          const newItem = `
          <div class="board-item item1" draggable>
            <div class="board-item-content">
              ${textarea.value} <i class="uil uil-trash-alt"></i>
            </div>
          </div>
          `;
          form.insertAdjacentHTML("beforeBegin", newItem);
          textarea.value = "";
          textarea.focus();
          dndTickets();
          deleteTicket();
        }
      }
    });
  });
}
addTicket();

function deleteTicket() {
  const deleteTicketBtns = document.querySelectorAll(".uil-trash-alt");
  deleteTicketBtns.forEach((btn) => {
    const ticket = btn.closest(".board-item");
    btn.addEventListener("click", () => {
      ticket.remove();
    });
  });
}
deleteTicket();

function showFormTicket() {
  const openFormBtns = document.querySelectorAll(".board__btn");
  openFormBtns.forEach((btn) => {
    const column = btn.closest(".column");
    const form = column.querySelector(".board-form");
    const textarea = column.querySelector(".board-form__textarea");
    btn.addEventListener("click", (e) => {
      form.style.display = "block";
      btn.style.display = "none";
      textarea.focus();
    });
  });
}

function cancelFormTicket() {
  const cancelFormBtns = document.querySelectorAll(".board-form__btn-cancel");
  cancelFormBtns.forEach((btn) => {
    const column = btn.closest(".column");
    const form = column.querySelector(".board-form");
    const addBtn = column.querySelector(".board__btn");
    btn.addEventListener("click", () => {
      form.style.display = "none";
      addBtn.style.display = "block";
    });
  });
}
