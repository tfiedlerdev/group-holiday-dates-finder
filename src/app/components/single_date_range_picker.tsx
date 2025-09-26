import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  DateSegment,
  DateValue,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
} from "react-aria-components";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RangeValue } from "@react-types/shared";
import "../react-aria-styles.css";

export function SingleDateRangePicker({
  onChange,
}: {
  onChange: (range: RangeValue<DateValue> | null) => void;
}) {
  return (
    <DateRangePicker onChange={onChange}>
      <Label>Trip dates</Label>
      <Group>
        <DateInput slot="start">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <span aria-hidden="true">–</span>
        <DateInput slot="end">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <Button>
          <KeyboardArrowDownIcon fontSize="large" />
        </Button>
      </Group>
      <Popover>
        <Dialog>
          <RangeCalendar>
            <header>
              <Button slot="previous">
                <KeyboardArrowLeftIcon fontSize="large" />
              </Button>
              <Heading />
              <Button slot="next">
                <KeyboardArrowRightIcon fontSize="large" />
              </Button>
            </header>
            <CalendarGrid>
              {(date) => <CalendarCell date={date} />}
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
}
