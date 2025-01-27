import { ChangeEvent } from 'react';

interface Props {
  sortedBy: string;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const SortDropdown = ({ sortedBy, handleChange }: Props) => {
  return (
    <div className='sort-dropdown'>
      <label htmlFor='sort-select' className='hide'>
        정렬
      </label>
      <select
        className='selectedSort'
        value={sortedBy}
        onChange={handleChange}
      >
        <option value='latest'>최신순</option>
        <option value='oldest'>과거순</option>
      </select>
    </div>
  );
}
