import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { fetchStreets } from "../../../../../api/FetchStreets";

import "../../../../../assets/styles/commonCheckoutInputesStyles.scss";

interface StreetInputProps {
  selectedCity: string | undefined;
  resetStreet: boolean;
  onStreetReset: () => void;
  disabled?: boolean; // Добавляем проп disabled
}

interface StreetInputRef {
  isValid: () => boolean;
  getValue: () => string | undefined;
}

const StreetInput = forwardRef<StreetInputRef, StreetInputProps>(
  (
    {
      selectedCity,
      resetStreet,
      onStreetReset,
      disabled, // Деструктурируем проп disabled
    },
    ref
  ) => {
    const [filteredStreets, setFilteredStreets] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>(""); // Изменено: Введённое значение хранится
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useImperativeHandle(ref, () => ({
      isValid() {
        return isValidForm();
      },
      getValue() {
        // Изменено: Возвращаем значение из поля ввода, даже если оно отсутствует в списке
        return inputValue.trim();
      },
    }));

    const isValidForm = () => {
      if (!inputValue.trim()) {
        setError("Заповніть поле");
        return false;
      }

      // Сбрасываем ошибку, если поле заполнено
      setError(null);
      return true;
    };

    const fetchStreetsData = useCallback(
      async (query: string) => {
        if (!selectedCity || query.length < 2) {
          setFilteredStreets([]);
          setError(null); // Сбрасываем ошибку
          return;
        }

        setError(null);

        try {
          const streetsData = await fetchStreets(selectedCity, query);
          setFilteredStreets(streetsData);

          // Убираем установку ошибки, если список пуст
          if (streetsData.length === 0) {
            setFilteredStreets([]); // Очищаем список, но не выставляем ошибку
          }
        } catch (err) {
          console.error("Error in fetchStreetsData:", err);
          setError("Помилка при виконанні запиту: " + (err as Error).message);
          setFilteredStreets([]);
        }
      },
      [selectedCity]
    );

    useEffect(() => {
      if (inputValue.length >= 2) {
        fetchStreetsData(inputValue);
      } else {
        setFilteredStreets([]);
      }
    }, [fetchStreetsData, inputValue]);

    useEffect(() => {
      if (resetStreet) {
        setInputValue("");
        setFilteredStreets([]);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onStreetReset();
      }
    }, [resetStreet, onStreetReset]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setIsOpen(true);
      setError(null); // Сбрасываем ошибку при любом изменении текста
    };

    const handleStreetSelect = (street: string) => {
      setInputValue(street); // Изменено: Устанавливаем выбранную улицу
      setIsOpen(false);
      setError(null);
    };

    const handleInputFocus = () => {
      if (filteredStreets.length > 0) {
        setIsOpen(true);
      }
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredStreets.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
      } else if (event.key === "Enter" && highlightedIndex !== -1) {
        event.preventDefault();
        handleStreetSelect(filteredStreets[highlightedIndex]);
      } else if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      if (highlightedIndex !== -1 && listRef.current) {
        const highlightedElement = listRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex]);

    return (
      <div className="input">
        <div className="input__container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Вулиця"
            className={`input__field ${error ? "input__field--error" : ""}`}
            disabled={disabled || !selectedCity} // Используем disabled
            maxLength={200}
          />
        </div>
        {isOpen && filteredStreets.length > 0 && (
          <ul ref={listRef} className="input__list">
            {filteredStreets.map((street, index) => (
              <li
                key={index}
                onMouseDown={() => handleStreetSelect(street)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`input__item ${
                  index === highlightedIndex ? "input__item--highlighted" : ""
                }`}
              >
                {street}
              </li>
            ))}
          </ul>
        )}
        {error && <div className="input__error">{error}</div>}
      </div>
    );
  }
);

export default StreetInput;
