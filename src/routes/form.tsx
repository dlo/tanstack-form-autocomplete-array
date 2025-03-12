import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/form')({
  component: RouteComponent,
});

type Person = {
  name: string;
  location: string;
}

const autocompletePlace = async (input: string): Promise<Array<string>> => {
  // TODO
  return [input + '1', input + '2', input + '3'];
};

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      referrer: '',
      people: [
        {
          name: '',
          location: '',
        },
      ] as Array<Person>,
    },
  });

  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const [activeAutocompleteIndex, setActiveAutocompleteIndex] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!autocompleteInput || autocompleteInput.trim() === '') {
      return;
    }
    const inner = async () => {
      const result = await autocompletePlace(autocompleteInput);
      setSuggestions(result);
    };

    inner();
  }, [autocompleteInput]);

  return (<form
    onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}
  >

    <form.Field name={'people'} mode={'array'}>
      {(field) => (
        <center>
          <button
            onClick={() =>
              field.pushValue({
                name: '',
                location: '',
              })
            }
            type="button"
            className={'w-full'}
          >
            Add Person
          </button>
          <br/>
          {field.state.value.map((_, i) => (
            <>
              <br />
              <form.Field
                key={`people[${i}].name`}
                name={`people[${i}].name`}
              >
                {(subField) => (
                  <input
                    placeholder={'Name'}
                    name={subField.name}
                    value={subField.state.value}
                    onChange={(e) => subField.handleChange(e.target.value)}
                  />
                )}
              </form.Field>

              <form.Field
                key={`people[${i}].location`}
                name={`people[${i}].location`}
                listeners={{
                  onChange: ({ value }) => {
                    setAutocompleteInput(value);
                    setActiveAutocompleteIndex(i);
                    if (value && value.trim() !== '') {
                      setShowSuggestions(true);
                    } else {
                      setShowSuggestions(false);
                    }
                  },
                  onBlur: () => {
                    setTimeout(() => {
                      setActiveAutocompleteIndex(null);
                      setShowSuggestions(false);
                    }, 200);
                  },
                }}
              >
                {(subField) => (
                  <>
                    <input
                      placeholder={'Location'}
                      name={subField.name}
                      value={subField.state.value}
                      onChange={(e) => subField.handleChange(e.target.value)}
                    />

                    {activeAutocompleteIndex === i && showSuggestions && suggestions.length > 0 && (
                      <div>
                        {suggestions.map((suggestion, i) => (
                          <div
                            key={`suggestion-${i}`}
                            onClick={() => subField.handleChange(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </form.Field>
              <br/>
            </>
          ))}
        </center>
      )}
    </form.Field>
  </form>);
}
