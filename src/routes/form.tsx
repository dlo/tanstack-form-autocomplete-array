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
  return [];
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
        <>
          {field.state.value.map((_, i) => (
            <>
              <form.Field
                key={`people[${i}].name`}
                name={`people[${i}].name`}
              >
                {(subField) => (
                  <input
                    name={subField.name}
                    value={subField.state.value}
                    onChange={(e) => subField.handleChange(e.target.value)}
                  />
                )}
              </form.Field>

              <form.Field
                key={`people[${i}].location`}
                name={`people[${i}].location`}
              >
                {(subField) => (
                  <>
                    <input
                      name={subField.name}
                      value={subField.state.value}
                      onChange={(e) => subField.handleChange(e.target.value)}
                    />

                    {activeAutocompleteIndex === i && suggestions.length > 0 && (
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
            </>
          ))}
        </>
      )}
    </form.Field>
  </form>);
}
