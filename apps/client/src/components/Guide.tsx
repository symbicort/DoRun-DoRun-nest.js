export default function Guide() {
  return (
    <div>
      <h2>Guide</h2>
      <h3 className='text-lg font-bold'>버튼들</h3>

      <button type='button' className='btn-xs'>
        Extra small
      </button>
      <button type='button' className='btn-sm'>
        Small
      </button>
      <button type='button' className='btn-md'>
        Base
      </button>
      <button type='button' className='btn-lg'>
        Large
      </button>
      <button type='button' className='btn-xl'>
        Extra large
      </button>

      <hr className='my-3' />
      <h3 className='text-lg font-bold'>버튼들 크기</h3>

      <button type='button' className='btn-xs w-full'>
        Extra small
      </button>
      <button type='button' className='btn-sm w-full'>
        Small
      </button>
      <button type='button' className='btn-md w-full'>
        Base
      </button>
      <button type='button' className='btn-lg w-full'>
        Large
      </button>
      <button type='button' className='btn-xl w-full'>
        Extra large
      </button>

      <hr className='my-3' />
      <h3 className='text-lg font-bold'>폼(Form)</h3>
      <ul className='form'>
        <li>
          <label for=''>User ID</label>
          <input type='text' id='' placeholder='User ID' required />
        </li>
        <li>
          <label forHtml=''>Password</label>
          <input type='password' id='' placeholder='Password' required />
        </li>
        <li>
          <label forHtml=''>input (풀 사이즈)</label>
          <input type='text' id='' class='w-full' placeholder='' required />
        </li>
        <li>
          <label forHtml=''>textarea (풀 사이즈)</label>
          <textarea id='' class='w-full' placeholder='' required />
        </li>
      </ul>
      <hr className='my-3' />
    </div>
  );
}
